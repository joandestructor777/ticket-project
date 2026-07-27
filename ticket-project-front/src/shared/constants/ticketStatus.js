export const TICKET_STATUS = {
  1: { label: 'Abierto', bgVar: '--status-opened-bg', textVar: '--status-opened-text' },
  2: { label: 'Asignado', bgVar: '--status-assigned-bg', textVar: '--status-assigned-text' },
  3: { label: 'En Proceso', bgVar: '--status-onprocess-bg', textVar: '--status-onprocess-text' },
  4: { label: 'Resuelto', bgVar: '--status-resolved-bg', textVar: '--status-resolved-text' },
  5: { label: 'Cerrado', bgVar: '--status-closed-bg', textVar: '--status-closed-text' },
  6: { label: 'Vencido', bgVar: '--status-expired-bg', textVar: '--status-expired-text' },
  7: { label: 'Reabierto', bgVar: '--status-reopened-bg', textVar: '--status-reopened-text' },

  Opened: { label: 'Abierto', bgVar: '--status-opened-bg', textVar: '--status-opened-text' },
  Assigned: { label: 'Asignado', bgVar: '--status-assigned-bg', textVar: '--status-assigned-text' },
  OnProcess: { label: 'En Proceso', bgVar: '--status-onprocess-bg', textVar: '--status-onprocess-text' },
  Resolved: { label: 'Resuelto', bgVar: '--status-resolved-bg', textVar: '--status-resolved-text' },
  Closed: { label: 'Cerrado', bgVar: '--status-closed-bg', textVar: '--status-closed-text' },
  Expired: { label: 'Vencido', bgVar: '--status-expired-bg', textVar: '--status-expired-text' },
  Reopened: { label: 'Reabierto', bgVar: '--status-reopened-bg', textVar: '--status-reopened-text' }
};

export const TICKET_PRIORITIES = {
  'Baja': { label: 'Baja', bgVar: '--priority-low-bg', textVar: '--priority-low-text', level: 1 },
  'Media': { label: 'Media', bgVar: '--priority-medium-bg', textVar: '--priority-medium-text', level: 2 },
  'Alta': { label: 'Alta', bgVar: '--priority-high-bg', textVar: '--priority-high-text', level: 3 },
  'Crítica': { label: 'Crítica', bgVar: '--priority-critical-bg', textVar: '--priority-critical-text', level: 4 }
};
