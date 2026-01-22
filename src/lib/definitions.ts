'use client';

import { z } from 'zod';

// Admin Entity Schemas
export const contractorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});
export type Contractor = z.infer<typeof contractorSchema>;

export const areaSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});
export type Area = z.infer<typeof areaSchema>;

export const tstSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});
export type TST = z.infer<typeof tstSchema>;

export const tsCmpcSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});
export type TSCMPC = z.infer<typeof tsCmpcSchema>;

export const safetySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});
export type Safety = z.infer<typeof safetySchema>;

// Adjusted to use contractorId
export const personnelSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  contractorId: z.string().min(1, 'Contractor is required'),
});
export type Personnel = z.infer<typeof personnelSchema>;

export const factorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});
export type Factory = z.infer<typeof factorySchema>;

export const criticalitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});
export type Criticality = z.infer<typeof criticalitySchema>;

// FAST-related Schemas
export const fastCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome é obrigatório'),
});
export type FastCategory = z.infer<typeof fastCategorySchema>;

export const fastOriginSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome é obrigatório'),
});
export type FastOrigin = z.infer<typeof fastOriginSchema>;

export const fastManagerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome é obrigatório'),
});
export type FastManager = z.infer<typeof fastManagerSchema>;

export const fipLinhaSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type FipLinha = z.infer<typeof fipLinhaSchema>;
export const fipGerenciaSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type FipGerencia = z.infer<typeof fipGerenciaSchema>;
export const fipTipoDeInvestimentoSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type FipTipoDeInvestimento = z.infer<typeof fipTipoDeInvestimentoSchema>;
export const fipClassificacaoSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type FipClassificacao = z.infer<typeof fipClassificacaoSchema>;
export const fipClassificacaoDePorteSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type FipClassificacaoDePorte = z.infer<typeof fipClassificacaoDePorteSchema>;
export const fipGerenteSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type FipGerente = z.infer<typeof fipGerenteSchema>;
export const fipContratoSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type FipContrato = z.infer<typeof fipContratoSchema>;


export const announcementSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'O texto do recado é obrigatório.'),
  isActive: z.boolean().default(true),
  createdAt: z.any().optional(),
});
export type Announcement = z.infer<typeof announcementSchema>;

export const rainbowSchema = z.object({
  id: z.string(),
  nomeFantasia: z.string().min(1, 'Nome Fantasia é obrigatório'),
  funcionario: z.string().min(1, 'Nome do funcionário é obrigatório'),
});
export type Rainbow = z.infer<typeof rainbowSchema>;

export const userRoleSchema = z.enum(['admin', 'gerente', 'visualizador', 'ts', 'user_fast']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.string().optional(), // ID will be set from Firebase Auth
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional(),
  contractorIds: z.array(z.string()).optional().default([]),
  role: userRoleSchema.default('visualizador'),
});
export type User = z.infer<typeof userSchema>;

export const dailySummarySchema = z.object({
  id: z.string(), // YYYY-MM-DD
  date: z.coerce.date(),
  projectsCreated: z.number().default(0),
  projectsCompleted: z.number().default(0),
  criticalProjects: z.number().default(0),
  projectsPlanned: z.number().default(0),
  projectsNotStarted: z.number().default(0),
  projectsInProgress: z.number().default(0),
  projectsOverdue: z.number().default(0),
});
export type DailySummary = z.infer<typeof dailySummarySchema>;


export const fastLogSchema = z.object({
  date: z.any(), // Timestamp or Date
  userName: z.string(),
  userRole: z.string(),
  action: z.string(),
});
export type FastLog = z.infer<typeof fastLogSchema>;

export const fastSchema = z.object({
  id: z.string().optional(),
  code: z.preprocess((val) => (val === '' || val === null || val === undefined || isNaN(val as number)) ? undefined : Number(val), z.number().optional()),
  title: z.string().min(1, "O Título da Intenção é obrigatório."),
  category: z.string().optional().default(''),
  origin: z.string().optional().default(''),
  manager: z.string().optional().default(''),
  benefits: z.string().optional().default(''),
  synthesis: z.string().optional().default(''),
  production: z.boolean().default(false),
  ma: z.boolean().default(false),
  sms: z.boolean().default(false),
  quality: z.boolean().default(false),
  gut: z.number().optional(),
  gravity: z.number().min(1).max(5),
  urgency: z.number().min(1).max(5),
  time: z.number().min(1).max(5),
  priorityConsiderations: z.string().optional().default(''),
  sendToStudy: z.boolean().default(false),
  status: z.string().optional().default('Em Análise'),
  createdAt: z.any().optional(),
  logs: z.array(fastLogSchema).optional().default([]),
});
export type Fast = z.infer<typeof fastSchema>;

export const adminEntitySchema = z.union([
  contractorSchema,
  areaSchema,
  tstSchema,
  tsCmpcSchema,
  safetySchema,
  personnelSchema,
  factorySchema,
  userSchema,
  criticalitySchema,
  announcementSchema,
  rainbowSchema,
  dailySummarySchema,
  fastSchema,
  fastCategorySchema,
  fastOriginSchema,
  fastManagerSchema,
  fipLinhaSchema,
  fipGerenciaSchema,
  fipTipoDeInvestimentoSchema,
  fipClassificacaoSchema,
  fipClassificacaoDePorteSchema,
  fipGerenteSchema,
  fipContratoSchema,
]);

export type AdminEntity = z.infer<typeof adminEntitySchema>;


export const adminEntityNameSchema = z.enum([
  'contractors',
  'areas',
  'tsts',
  'tscmpcs',
  'safeties',
  'personnels',
  'factories',
  'users',
  'criticalities',
  'announcements',
  'rainbows',
  'fasts',
  'fast_categories',
  'fast_origins',
  'fast_managers',
  'fast_linhas',
  'fast_gerencias',
  'fast_tipos_de_investimento',
  'fast_classificacoes',
  'fast_classificacoes_de_porte',
  'fast_gerentes',
  'fast_contratos',
]);
export type AdminEntityName = z.infer<typeof adminEntityNameSchema>;

// Main Project Schema
export const clearanceSchema = z.object({
  'INÍCIO da ATIVIDADE': z.coerce.date().optional().nullable(),
  'PT': z.coerce.date().optional().nullable(),
  'PREVENCIONISTA': z.coerce.date().optional().nullable(),
  'SUPERVISOR': z.coerce.date().optional().nullable(),
  'OPERADOR DE ÁREA': z.coerce.date().optional().nullable(),
  'TS': z.coerce.date().optional().nullable(),
  'FINAL DA ATIVIDADE': z.coerce.date().optional().nullable(),
});
export type Clearances = z.infer<typeof clearanceSchema>;

const activitySummarySchema = z.object({
  date: z.coerce.date(),
  text: z.string(),
  userEmail: z.string().optional(),
});
export type ActivitySummary = z.infer<typeof activitySummarySchema>;

const observationSchema = z.object({
  date: z.coerce.date(),
  text: z.string(),
});
export type Observation = z.infer<typeof observationSchema>;

const progressHistorySchema = z.object({
  date: z.coerce.date(),
  progress: z.number(),
});

const agendaHistorySchema = z.object({
  date: z.coerce.date(),
  setAt: z.coerce.date(),
});
export type AgendaHistory = z.infer<typeof agendaHistorySchema>;

const markerSchema = z.object({
  x: z.number(),
  y: z.number(),
  number: z.number(),
});
export type Marker = z.infer<typeof markerSchema>;


export const projectSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1, 'O nome do projeto é obrigatório.'),
  agendaDate: z.coerce.date().optional().nullable(), // For form handling only, not saved directly
  agendaHistory: z.array(agendaHistorySchema).optional().default([]),
  startDate: z.coerce.date().optional().nullable(),
  estimatedCompletionDate: z.coerce.date().optional().nullable(),
  completionDate: z.coerce.date().optional().nullable(),
  critical: z.boolean().optional().default(false),
  criticalityIds: z.array(z.string()).optional().default([]),
  requester: z.string().optional().default(''),
  tsCmpcIds: z.array(z.string()).optional().default([]),
  tsCmpc: z.array(z.string()).optional().default([]),
  factory: z.string().optional().default(''),
  orderNumber: z.union([z.string(), z.number()]).transform(val => String(val || '')).pipe(z.string()),
  contractor: z.string().default(''),
  contractorId: z.string().optional().nullable(),
  area: z.string().optional().default(''),
  leader: z.array(z.string()).optional().default([]),
  safety: z.array(z.string()).optional().default([]),
  personnel: z.array(z.string()).optional().default([]),
  tst: z.array(z.string()).optional().default([]),
  clearances: clearanceSchema.optional().nullable().default({}),
  activity: z.string().optional().default(''),
  implementation: z.string().optional().default(''),
  activitySummary: z.array(activitySummarySchema).optional().default([]),
  observationHistory: z.array(observationSchema).optional().default([]),
  progress: z.number().min(0).max(100).optional().default(0),
  progressHistory: z.array(progressHistorySchema).optional().default([]),
  photoBefore: z.string().optional().nullable(),
  photoAfter: z.string().optional().nullable(),
  markersBefore: z.array(markerSchema).optional().default([]),
  markersAfter: z.array(markerSchema).optional().default([]),
  createdAt: z.coerce.date().default(() => new Date()),
});

export type Project = z.infer<typeof projectSchema>;

export const projectFilterSchema = z.object({
  contractor: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  agendaDate: z.date().optional(),
  query: z.string().optional(),
  orderNumber: z.string().optional(),
  leader: z.array(z.string()).optional(),
});

export type ProjectFilters = z.infer<typeof projectFilterSchema>;

export const fipSchema = z.object({
  id: z.string().optional(),
  reportNumber: z.number().optional(),
  version: z.string().optional().default(''),
  unit: z.string().optional().default(''),
  plant: z.string().optional().default(''),
  title: z.string().min(1, 'O título é obrigatório'),
  competitivenessContract: z.string().optional().default(''),
  classification: z.string().optional().default(''),
  studyYear: z.number().optional(),
  area: z.string().optional().default(''),
  subArea: z.string().optional().default(''),
  category: z.string().optional().default(''),
  isFromAcr: z.boolean().default(false),
  criticality: z.string().optional().default(''),
  implementationYear: z.number().optional(),
  requestingManagement: z.string().optional().default(''),
  requestingManager: z.string().optional().default(''),
  focalPoint: z.string().optional().default(''),
  productionImpact: z.boolean().default(false),
  environmentImpact: z.boolean().default(false),
  preliminaryCost: z.number().optional().nullable(),
  line: z.string().optional().default(''),
  safetyImpact: z.boolean().default(false),
  qualityImpact: z.boolean().default(false),
  requesterName: z.string().optional().default(''),
  projectScope: z.string().optional().default(''),
  generalObservations: z.string().optional().default(''),
  photo: z.string().nullable().optional(),
  status: z.string().optional().default('Em Análise'),
  createdAt: z.any().optional(),
});

export type Fip = z.infer<typeof fipSchema>;

export const ripLinhaSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type RipLinha = z.infer<typeof ripLinhaSchema>;
export const ripGerenciaSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type RipGerencia = z.infer<typeof ripGerenciaSchema>;
export const ripTipoDeInvestimentoSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type RipTipoDeInvestimento = z.infer<typeof ripTipoDeInvestimentoSchema>;
export const ripClassificacaoSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type RipClassificacao = z.infer<typeof ripClassificacaoSchema>;
export const ripClassificacaoDePorteSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type RipClassificacaoDePorte = z.infer<typeof ripClassificacaoDePorteSchema>;
export const ripGerenteSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type RipGerente = z.infer<typeof ripGerenteSchema>;
export const ripContratoSchema = z.object({ id: z.string(), name: z.string().min(1, "O nome é obrigatório") });
export type RipContrato = z.infer<typeof ripContratoSchema>;

export const ripSchema = z.object({
  id: z.string().optional(),
  reportNumber: z.number().optional(),
  version: z.string().optional().default(''),
  unit: z.string().optional().default(''),
  plant: z.string().optional().default(''),
  title: z.string().min(1, 'O título é obrigatório'),
  competitivenessContract: z.string().optional().default(''),
  classification: z.string().optional().default(''),
  studyYear: z.number().optional(),
  area: z.string().optional().default(''),
  subArea: z.string().optional().default(''),
  category: z.string().optional().default(''),
  isFromAcr: z.boolean().default(false),
  criticality: z.string().optional().default(''),
  implementationYear: z.number().optional(),
  requestingManagement: z.string().optional().default(''),
  requestingManager: z.string().optional().default(''),
  focalPoint: z.string().optional().default(''),
  productionImpact: z.boolean().default(false),
  environmentImpact: z.boolean().default(false),
  preliminaryCost: z.number().optional().nullable(),
  line: z.string().optional().default(''),
  safetyImpact: z.boolean().default(false),
  qualityImpact: z.boolean().default(false),
  requesterName: z.string().optional().default(''),
  projectScope: z.string().optional().default(''),
  generalObservations: z.string().optional().default(''),
  photo: z.string().nullable().optional(),
  status: z.string().optional().default('Em Análise'),
  createdAt: z.any().optional(),
});

export type Rip = z.infer<typeof ripSchema>;
