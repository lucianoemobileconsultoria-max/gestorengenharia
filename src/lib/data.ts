import type { Contractor, Area, TST, Safety, Personnel, Factory, Project, Criticality } from './definitions';

// These initial values can be used to pre-populate the database if needed,
// but they will not be used if the database already has data.
// The useLocalStorage hook will no longer be the primary source of truth for these.

export const initialContractors: Contractor[] = [
  { id: '1', name: 'ConstructCo' },
  { id: '2', name: 'Engenharia Alfa' },
  { id: '3', name: 'Soluções Beta' },
];

export const initialAreas: Area[] = [
  { id: '1', name: 'Área 51' },
  { id: '2', name: 'Setor Norte' },
  { id: '3', name: 'Planta Sul' },
];

export const initialTsts: TST[] = [
  { id: '1', name: 'João Técnico' },
  { id: '2', name: 'Maria Segurança' },
];

export const initialSafeties: Safety[] = [
  { id: '1', name: 'Uso de EPI' },
  { id: '2', name: 'Bloqueio de Energia' },
  { id: '3', name: 'Trabalho em Altura' },
];

export const initialPersonnels: Personnel[] = [
  { id: '1', name: 'João Silva', contractorId: '1' },
  { id: '2', name: 'Maria Souza', contractorId: '1' },
  { id: '3', name: 'Carlos Lima', contractorId: '2' },
  { id: '4', name: 'Ana Pereira', contractorId: '3' },
];

export const initialFactories: Factory[] = [
  { id: '1', name: 'Fábrica Principal' },
  { id: '2', name: 'Fábrica Secundária' },
];

export const initialCriticalities: Criticality[] = [
    { id: '1', name: 'Espaço Confinado'},
    { id: '2', name: 'Altura'},
    { id: '3', name: 'Içamento'},
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Renovação do Sistema de Ventilação',
    startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    estimatedCompletionDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    critical: true,
    criticalityIds: ['1'],
    factory: 'Fábrica Principal',
    orderNumber: 'CO-12345',
    contractor: 'ConstructCo',
    contractorId: '1',
    area: 'Setor Norte',
    leader: ['Sr. Robson'],
    requester: 'Gerência Industrial', // Adicionado
    safety: ['Uso de EPI', 'Trabalho em Altura'],
    personnel: ['João Silva', 'Maria Souza'],
    tst: ['João Técnico'],
    tsCmpc: [], // Adicionado
    tsCmpcIds: [], // Adicionado
    clearances: {
      'INÍCIO da ATIVIDADE': new Date(new Date().setDate(new Date().getDate() - 5)),
      'PT': new Date(new Date(new Date().setDate(new Date().getDate() - 5)).setMinutes(10)),
      'PREVENCIONISTA': new Date(new Date(new Date().setDate(new Date().getDate() - 5)).setMinutes(25)),
    },
    activity: '',
    implementation: 'Seguindo o plano A.',
    observationHistory: [
        { date: new Date(new Date().setDate(new Date().getDate() - 1)), text: 'Poeira excessiva na área.'}
    ],
    agendaHistory: [
        { date: new Date(new Date().setDate(new Date().getDate() - 5)), setAt: new Date(new Date().setDate(new Date().getDate() - 5)) }
    ],
    activitySummary: [
      { date: new Date(new Date().setDate(new Date().getDate() - 1)), text: 'Estrutura 80% desmontada.', userEmail: 'sistema@exemplo.com' },
      { date: new Date(new Date().setDate(new Date().getDate() - 3)), text: 'Início da desmontagem.', userEmail: 'sistema@exemplo.com' },
    ],
    progress: 45,
    progressHistory: [
      { date: new Date(new Date().setDate(new Date().getDate() - 4)), progress: 10 },
      { date: new Date(new Date().setDate(new Date().getDate() - 2)), progress: 30 },
      { date: new Date(new Date().setDate(new Date().getDate() - 1)), progress: 45 },
    ],
    markersBefore: [], // Adicionado
    markersAfter: [], // Adicionado
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: 'proj-2',
    name: 'Instalação de Novos Sensores',
    startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    estimatedCompletionDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    critical: false,
    criticalityIds: [],
    factory: 'Fábrica Secundária',
    orderNumber: 'CO-67890',
    contractor: 'Engenharia Alfa',
    contractorId: '2',
    area: 'Planta Sul',
    leader: ['Sra. Aline'],
    requester: 'Manutenção Elétrica', // Adicionado
    safety: ['Uso de EPI', 'Bloqueio de Energia'],
    personnel: ['Carlos Lima'],
    tst: [],
    tsCmpc: [], // Adicionado
    tsCmpcIds: [], // Adicionado
    clearances: {
      'INÍCIO da ATIVIDADE': new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    activity: '',
    implementation: 'Conforme diagrama elétrico.',
    observationHistory: [],
    agendaHistory: [
        { date: new Date(new Date().setDate(new Date().getDate() - 2)), setAt: new Date(new Date().setDate(new Date().getDate() - 2)) }
    ],
    activitySummary: [
      { date: new Date(new Date().setDate(new Date().getDate() - 1)), text: 'Cabos 50% passados.', userEmail: 'sistema@exemplo.com' },
    ],
    progress: 30,
    progressHistory: [
      { date: new Date(new Date().setDate(new Date().getDate() - 1)), progress: 30 },
    ],
    markersBefore: [], // Adicionado
    markersAfter: [], // Adicionado
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: 'proj-3',
    name: 'Manutenção Preventiva do Gerador',
    startDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    estimatedCompletionDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    critical: false,
    criticalityIds: [],
    factory: 'Fábrica Principal',
    orderNumber: 'CO-54321',
    contractor: 'Soluções Beta',
    contractorId: '3',
    area: 'Área 51',
    leader: ['Sr. Marcos'],
    requester: 'Engenharia de Projetos', // Adicionado
    safety: [],
    personnel: [],
    tst: [],
    tsCmpc: [], // Adicionado
    tsCmpcIds: [], // Adicionado
    clearances: {},
    activity: '',
    implementation: '',
    observationHistory: [],
    agendaHistory: [
         { date: new Date(new Date().setDate(new Date().getDate() + 2)), setAt: new Date(new Date().setDate(new Date().getDate() - 1)) }
    ],
    activitySummary: [],
    progress: 0,
    progressHistory: [],
    markersBefore: [], // Adicionado
    markersAfter: [], // Adicionado
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
];
