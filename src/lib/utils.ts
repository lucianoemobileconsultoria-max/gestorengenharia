import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Project, ProjectFilters } from '@/lib/definitions';
import { differenceInMinutes, differenceInDays, format, formatDistanceToNow, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ProjectStatus = 'Planejado' | 'Não Iniciado' | 'Em Andamento' | 'Concluído' | 'Atrasado';

export function getProjectStatus(project: Project, referenceDate?: Date): { status: ProjectStatus; color: string, textColor: string } {
  const now = referenceDate || new Date();

  if (project.progress === 100) {
    return { status: 'Concluído', color: '#dcfce7', textColor: '#166534' };
  }

  if (project.estimatedCompletionDate && now > new Date(project.estimatedCompletionDate)) {
    return { status: 'Atrasado', color: '#ef4444', textColor: '#ffffff' };
  }

  if (!project.startDate) {
    return { status: 'Planejado', color: '#fef9c3', textColor: '#854d0e' };
  }

  const startDate = new Date(project.startDate);

  if (now < startDate) {
    return { status: 'Planejado', color: '#fef9c3', textColor: '#854d0e' };
  }

  if (now >= startDate && project.progress === 0) {
    return { status: 'Não Iniciado', color: '#3b82f6', textColor: '#ffffff' };
  }

  if (now >= startDate && project.progress > 0) {
    return { status: 'Em Andamento', color: '#f97316', textColor: '#ffffff' };
  }

  return { status: 'Planejado', color: '#facc15', textColor: '#1e1b4b' };
}

export function calculatePredictedProgress(project: Project): number {
  const { startDate, estimatedCompletionDate, completionDate, progress } = project;

  if (!startDate || !estimatedCompletionDate || !isValid(new Date(startDate)) || !isValid(new Date(estimatedCompletionDate))) {
    return 0;
  }

  if (progress === 100) {
    return 100;
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(estimatedCompletionDate);

  if (now < start) {
    return 0;
  }

  if (now >= end) {
    return 100;
  }

  const totalDuration = differenceInMinutes(end, start);
  if (totalDuration <= 0) {
    return 100;
  }

  const elapsedDuration = differenceInMinutes(now, start);
  const predicted = (elapsedDuration / totalDuration) * 100;

  return Math.min(100, Math.round(predicted));
}

export function formatElapsedTime(start: Date, end: Date): { text: string; isOverdue: boolean } {
  const minutes = differenceInMinutes(end, start);
  const isOverdue = minutes > 30;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const text = `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
  return { text, isOverdue };
}

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
};

const EXPORT_HEADERS = [
  'ID', 'Nome', 'Status', 'Crítico', 'Consultor', 'Progresso', 'Data Início', 'Data Estimada', 'Data Conclusão', 'Agenda do Dia',
  'Fábrica', 'Pedido', 'Contratada', 'Área', 'Implantador', 'Segurança', 'Efetivo', 'TST', 'Liberações', 'Atualizações de Atividade', 'Histórico de Observações'
];

export function exportTemplateToXlsx() {
  const TEMPLATE_HEADERS_PROJECTS = [
    'ID',
    'Nome',
    'Crítico',
    'Consultor',
    'Progresso',
    'Data Início',
    'Data Estimada',
    'Data Conclusão',
    'Agenda do Dia',
    'Fábrica',
    'Pedido',
    'Contratada',
    'ID Contratada',
    'Área',
    'Implantador',
    'Segurança',
    'Efetivo',
    'TST',
    'TS CMPC',
    'Criticidades',
    'Liberação Início Atividade',
    'Liberação PT',
    'Liberação Prevencionista',
    'Liberação Supervisor',
    'Liberação Operador Área',
    'Liberação TS',
    'Liberação Final Atividade'
  ];

  const TEMPLATE_HEADERS_RAINBOW = [
    'Nome Fantasia', 'Funcionário',
  ];

  const workbook = XLSX.utils.book_new();

  const projectsWorksheet = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS_PROJECTS]);
  XLSX.utils.book_append_sheet(workbook, projectsWorksheet, "Template_Projetos");

  const rainbowWorksheet = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS_RAINBOW]);
  XLSX.utils.book_append_sheet(workbook, rainbowWorksheet, "Template_Rainbow");

  XLSX.writeFile(workbook, "template_importacao.xlsx");
}

export function exportToXlsx(data: Project[], filters: ProjectFilters) {
  const rows = data.map(p => {
    const clearancesString = Object.entries(p.clearances || {})
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${formatDateTime(value as Date)}`)
      .join('\n');

    const activitySummaryString = (p.activitySummary || [])
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(activity => `${formatDateTime(activity.date)} (${activity.userEmail || 'Sistema'}): ${activity.text}`)
      .join('\n');

    const observationHistoryString = (p.observationHistory || [])
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(obs => `${formatDateTime(obs.date)}: ${obs.text}`)
      .join('\n');

    const isCritical = p.critical ? 'Sim' : 'Não';

    const getLatestAgendaDate = (project: Project) => {
      if (!project.agendaHistory || project.agendaHistory.length === 0) {
        return null;
      }
      const sorted = [...project.agendaHistory].sort((a, b) => new Date(b.setAt).getTime() - new Date(a.setAt).getTime());
      return sorted[0].date;
    }

    const latestAgendaDate = getLatestAgendaDate(p);

    const row: Record<string, any> = {};
    row['ID'] = p.id;
    row['Nome'] = p.name;
    row['Status'] = getProjectStatus(p).status;
    row['Crítico'] = isCritical;
    row['Consultor'] = p.requester;
    row['Progresso'] = `${p.progress}%`;
    row['Data Início'] = p.startDate ? format(new Date(p.startDate), 'dd/MM/yyyy HH:mm') : '';
    row['Data Estimada'] = p.estimatedCompletionDate ? format(new Date(p.estimatedCompletionDate), 'dd/MM/yyyy HH:mm') : '';
    row['Data Conclusão'] = p.completionDate ? format(new Date(p.completionDate), 'dd/MM/yyyy HH:mm') : '';
    row['Agenda do Dia'] = latestAgendaDate ? format(new Date(latestAgendaDate), 'dd/MM/yyyy') : '';
    row['Fábrica'] = p.factory;
    row['Pedido'] = p.orderNumber;
    row['Contratada'] = p.contractor;
    row['Área'] = p.area;
    row['Implantador'] = Array.isArray(p.leader) ? p.leader.join(', ') : p.leader;
    row['Segurança'] = p.safety?.join(', ');
    row['Efetivo'] = p.personnel?.join(', ');
    row['TST'] = p.tst?.join(', ');
    row['Liberações'] = clearancesString;
    row['Atualizações de Atividade'] = activitySummaryString;
    row['Histórico de Observações'] = observationHistoryString;

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: EXPORT_HEADERS });

  const colWidths = EXPORT_HEADERS.map(header => {
    const maxLength = Math.max(
      header.length,
      ...rows.map(row => String(row[header] || '').length)
    );
    return { wch: Math.min(60, maxLength + 5) };
  });

  rows.forEach((row, rowIndex) => {
    const multilineFields = ["Liberações", "Atualizações de Atividade", "Histórico de Observações"];
    let maxLines = 1;
    multilineFields.forEach(field => {
      const lines = (row[field] || '').split('\n').length;
      if (lines > maxLines) maxLines = lines;
    });
    if (maxLines > 1) {
      worksheet['!rows'] = worksheet['!rows'] || [];
      worksheet['!rows'][rowIndex + 1] = { hpt: 15 * maxLines };
    }
  });

  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Projetos");
  XLSX.writeFile(workbook, "planejamento_semanal.xlsx");
}

export const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const formatDateTime = (date?: Date | string | null) => {
  if (!date) return '';
  const d = new Date(date);
  if (!isValid(d)) return '';
  try {
    return format(d, 'dd/MM/yyyy HH:mm');
  } catch (e) {
    return '';
  }
}

export const formatDateShort = (date?: Date | string | null) => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd/MM/yy');
  } catch (e) {
    return '-';
  }
}

export const formatRelativeDate = (date?: Date | string) => {
  if (!date) return '-';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  } catch (e) {
    return '-';
  }
};
