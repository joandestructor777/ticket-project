// Datos simulados (Mock) 100% en español tanto en campos de negocio como de visualización
const MOCK_TICKETS = [
  {
    id: 101,
    title: 'Tiempo de espera agotado de conexión a base de datos en producción',
    description: 'La API está arrojando errores 504 al conectarse a la instancia de base de datos SQL Server principal.',
    category: 'Red',
    priority: 'Crítica',
    estado: 'Expired',
    fechaCreacion: '2026-07-18T10:00:00Z',
    fechaLimiteSLA: '2026-07-18T12:00:00Z', // 2 horas SLA (Red + Critica)
    tecnicoId: 3,
    alertaVencimientoRegistrada: true,
    logAlerta: '[ALERTA DE SLA VENCIDO - 2026-07-18 12:00:00 UTC] Razón: El tiempo límite del SLA ha sido superado.'
  },
  {
    id: 102,
    title: 'Teclado de repuesto para recepción',
    description: 'La barra espaciadora del teclado en la recepción está rota y se queda pegada.',
    category: 'Hardware',
    priority: 'Baja',
    estado: 'Opened',
    fechaCreacion: '2026-07-18T15:00:00Z',
    fechaLimiteSLA: '2026-07-19T15:00:00Z', // 24 horas SLA (Hardware + Baja)
    tecnicoId: null,
    alertaVencimientoRegistrada: false,
    logAlerta: null
  },
  {
    id: 103,
    title: 'Error de configuración de VPN para usuarios remotos',
    description: 'Varios empleados remotos reportan que no pueden acceder a la intranet tras la actualización del firewall.',
    category: 'Red',
    priority: 'Alta',
    estado: 'Expired',
    fechaCreacion: '2026-07-18T08:00:00Z',
    fechaLimiteSLA: '2026-07-18T12:00:00Z', // 4 horas SLA (Red + Alta)
    tecnicoId: 1,
    alertaVencimientoRegistrada: true,
    logAlerta: '[ALERTA DE SLA VENCIDO - 2026-07-18 12:00:00 UTC] Razón: El tiempo límite de resolución asignado por SLA ha expirado.'
  },
  {
    id: 104,
    title: 'Fallo de configuración de audio en Microsoft Teams',
    description: 'Teams se cierra inesperadamente cuando un usuario intenta cambiar la fuente de audio activa durante una llamada en vivo.',
    category: 'Software',
    priority: 'Media',
    estado: 'OnProcess',
    fechaCreacion: '2026-07-19T02:00:00Z',
    fechaLimiteSLA: '2026-07-19T10:00:00Z',
    tecnicoId: 2,
    alertaVencimientoRegistrada: false,
    logAlerta: null
  },
  {
    id: 105,
    title: 'Bucle de actualización en firmware de impresora',
    description: 'La impresora principal de la oficina está atascada en un bucle de reinicio mostrando "Error 49.38.07".',
    category: 'Hardware',
    priority: 'Crítica',
    estado: 'Reopened',
    fechaCreacion: '2026-07-19T03:00:00Z',
    fechaLimiteSLA: '2026-07-19T07:00:00Z',
    tecnicoId: 4,
    alertaVencimientoRegistrada: false,
    logAlerta: null
  },
  {
    id: 106,
    title: 'Aprovisionamiento de accesos para nuevo ingreso',
    description: 'Crear credenciales de Windows Active Directory y configurar cuenta de correo para el nuevo ejecutivo de ventas.',
    category: 'Software',
    priority: 'Baja',
    estado: 'Resolved',
    fechaCreacion: '2026-07-18T09:00:00Z',
    fechaLimiteSLA: '2026-07-19T09:00:00Z',
    fechaResolucion: '2026-07-18T17:30:00Z',
    tecnicoId: 2,
    alertaVencimientoRegistrada: false,
    logAlerta: null
  }
];

export const ticketService = {
  getTickets: async () => {
    // Simular retraso de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...MOCK_TICKETS];
  }
};
