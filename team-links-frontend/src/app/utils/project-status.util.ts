import { ProjectStatus, PROJECT_STATUS_OPTIONS } from '../models/types';

export function resolveProjectStatus(status: ProjectStatus | undefined | null): ProjectStatus {
  return status ?? 'INICIAR';
}

export function projectStatusLabel(status: ProjectStatus | undefined | null): string {
  const resolved = resolveProjectStatus(status);
  return PROJECT_STATUS_OPTIONS.find(o => o.value === resolved)?.label ?? resolved;
}

export function projectStatusClass(status: ProjectStatus | undefined | null): string {
  switch (resolveProjectStatus(status)) {
    case 'INICIAR': return 'status-iniciar';
    case 'EM_ANDAMENTO': return 'status-andamento';
    case 'CONCLUIDO': return 'status-concluido';
  }
}

export function isProjectCompleted(status: ProjectStatus | undefined | null): boolean {
  return resolveProjectStatus(status) === 'CONCLUIDO';
}
