'use client';

import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect, useMemo } from 'react';
import type { Project, ProjectFilters, User } from './definitions';
import { getProjectStatus } from './utils';
import { useCollection, useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { startOfDay, endOfDay } from 'date-fns';

type State = {
  projects: Project[];
  filters: ProjectFilters;
  currentUser: User | null;
};

type Action =
  | { type: 'SET_FILTERS'; payload: ProjectFilters }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_USER'; payload: User | null };

const getInitialState = (): State => ({
  projects: [],
  filters: {},
  currentUser: null,
});

function projectReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_CURRENT_USER':
        return { ...state, currentUser: action.payload };
    default:
      return state;
  }
}

const ProjectStateContext = createContext<State | undefined>(undefined);
const ProjectDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, getInitialState());
  const { firestore, user, isUserLoading } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc<User>(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !isUserDataLoading) {
      dispatch({ type: 'SET_CURRENT_USER', payload: userData || null });
    }
  }, [userData, isUserDataLoading, isUserLoading]);
  
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || isUserDataLoading || !userData) {
      // Return null to wait for user data to be loaded
      return null;
    }
    
    // Admins and Gerentes can see all projects
    if (userData.role === 'admin' || userData.role === 'gerente') {
      return collection(firestore, 'projects');
    }

    // Other users are restricted by their assigned contractorIds
    if (userData.contractorIds && userData.contractorIds.length > 0) {
      return query(collection(firestore, 'projects'), where('contractorId', 'in', userData.contractorIds));
    }
    
    // If a user has no contractorIds, they see no projects.
    // An 'in' query with an empty array is invalid, so we query for a non-existent ID.
    return query(collection(firestore, 'projects'), where('contractorId', '==', '___NON_EXISTENT___'));
  }, [firestore, userData, isUserDataLoading]);

  const { data: projectsFromFirestore, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);

  useEffect(() => {
    if (!isLoadingProjects && projectsFromFirestore) {
      const projectsWithDates = projectsFromFirestore.map(p => {
        // Firestore timestamps need to be converted to JS Dates
        const anyProject = p as any;
        return {
        ...p,
        agendaHistory: anyProject.agendaHistory?.map((a: any) => ({...a, date: a.date?.toDate(), setAt: a.setAt?.toDate() })) || [],
        startDate: anyProject.startDate?.toDate(),
        estimatedCompletionDate: anyProject.estimatedCompletionDate?.toDate(),
        completionDate: anyProject.completionDate?.toDate(),
        createdAt: anyProject.createdAt?.toDate(),
        tsCmpc: Array.isArray(p.tsCmpc) ? p.tsCmpc : [],
        leader: Array.isArray(p.leader) ? p.leader : (p.leader ? [p.leader] : []),
        // CORREÇÃO AQUI: Tipagem do reduce simplificada para evitar erro de 'possibly null'
        clearances: Object.entries(anyProject.clearances || {}).reduce((acc: any, [key, value]: [string, any]) => {
            acc[key] = value?.toDate();
            return acc;
        }, {}),
        activitySummary: anyProject.activitySummary?.map((a: any) => ({...a, date: a.date?.toDate(), text: a.text || '', userEmail: a.userEmail || '' })) || [],
        observationHistory: anyProject.observationHistory?.map((o: any) => ({...o, date: o.date?.toDate(), text: o.text || '' })) || [],
        progressHistory: anyProject.progressHistory?.map((h: any) => ({...h, date: h.date?.toDate(), progress: h.progress || 0 })) || [],
        markersBefore: anyProject.markersBefore || [],
        markersAfter: anyProject.markersAfter || [],
      }});
      dispatch({ type: 'SET_PROJECTS', payload: projectsWithDates });
    }
  }, [projectsFromFirestore, isLoadingProjects]);

  return (
    <ProjectStateContext.Provider value={state}>
      <ProjectDispatchContext.Provider value={dispatch}>
        {children}
      </ProjectDispatchContext.Provider>
    </ProjectStateContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectStateContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}

export function useProjectDispatch() {
  const context = useContext(ProjectDispatchContext);
  if (context === undefined) {
    throw new Error('useProjectDispatch must be used within a ProjectProvider');
  }
  return context;
}

export function useFilteredProjects() {
  const { projects, filters } = useProjects();

  return useMemo(() => {
    return projects.filter(project => {
      // Search filter (name or order number)
      if (filters.query) {
        const searchTerm = filters.query.toLowerCase();
        const nameMatch = project.name.toLowerCase().includes(searchTerm);
        const orderMatch = project.orderNumber && String(project.orderNumber).toLowerCase().includes(searchTerm);
        if (!nameMatch && !orderMatch) {
            return false;
        }
      }
      // Contractor filter
      if (filters.contractor && project.contractor !== filters.contractor) {
        return false;
      }
       // Order Number filter
      if (filters.orderNumber && project.orderNumber !== filters.orderNumber) {
        return false;
      }
       // Leader/Implantador filter
       if (filters.leader && filters.leader.length > 0) {
        if (!project.leader || !project.leader.some(l => filters.leader?.includes(l))) {
          return false;
        }
      }
      // Status filter
      if (filters.status) {
        const status = getProjectStatus(project).status;
        if (filters.status === 'Planejado' && status !== 'Planejado') return false;
        if (filters.status === 'Em Andamento' && !['Em Andamento', 'Atrasado', 'Não Iniciado'].includes(status)) return false;
        if (filters.status === 'Concluído' && status !== 'Concluído') return false;
      }
      // Date range filter for startDate
      if (filters.dateRange?.from && project.startDate && new Date(project.startDate) < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange?.to && project.startDate && new Date(project.startDate) > filters.dateRange.to) {
        return false;
      }
      // Agenda do Dia filter
      if (filters.agendaDate) {
        const latestAgendaEntry = project.agendaHistory?.sort((a,b) => new Date(b.setAt).getTime() - new Date(a.setAt).getTime())[0];
        if (!latestAgendaEntry) return false;
        
        const agendaDay = startOfDay(new Date(latestAgendaEntry.date));
        const filterDay = startOfDay(new Date(filters.agendaDate));
        if (agendaDay.getTime() !== filterDay.getTime()) {
            return false;
        }
      }
      return true;
    }).sort((a, b) => {
        // Sort by start date descending, then by ID
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        if (dateB !== dateA) {
          return dateB - dateA;
        }
        return a.id.localeCompare(b.id);
      });
  }, [projects, filters]);
}
