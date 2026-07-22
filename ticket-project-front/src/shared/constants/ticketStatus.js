export const TICKET_STATUS = {
  Opened: {
    label: 'Abierto',
    bgVar: '--status-opened-bg',
    textVar: '--status-opened-text',
    icon: '📂'
  },
  Assigned: {
    label: 'Asignado',
    bgVar: '--status-assigned-bg',
    textVar: '--status-assigned-text',
    icon: '👤'
  },
  OnProcess: {
    label: 'En Proceso',
    bgVar: '--status-onprocess-bg',
    textVar: '--status-onprocess-text',
    icon: '⚡'
  },
  Resolved: {
    label: 'Resuelto',
    bgVar: '--status-resolved-bg',
    textVar: '--status-resolved-text',
    icon: '✅'
  },
  Closed: {
    label: 'Cerrado',
    bgVar: '--status-closed-bg',
    textVar: '--status-closed-text',
    icon: '🔒'
  },
  Expired: {
    label: 'Vencido',
    bgVar: '--status-expired-bg',
    textVar: '--status-expired-text',
    icon: '🚨'
  },
  Reopened: {
    label: 'Reabierto',
    bgVar: '--status-reopened-bg',
    textVar: '--status-reopened-text',
    icon: '🔄'
  }
};

export const TICKET_PRIORITIES = {
  'Baja': { label: 'Baja', bgVar: '--priority-low-bg', textVar: '--priority-low-text', level: 1 },
  'Media': { label: 'Media', bgVar: '--priority-medium-bg', textVar: '--priority-medium-text', level: 2 },
  'Alta': { label: 'Alta', bgVar: '--priority-high-bg', textVar: '--priority-high-text', level: 3 },
  'Crítica': { label: 'Crítica', bgVar: '--priority-critical-bg', textVar: '--priority-critical-text', level: 4 }
};
