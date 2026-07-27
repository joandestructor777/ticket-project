import React from 'react';
import Badge from '../../../shared/components/Badge';
import { TICKET_PRIORITIES } from '../../../shared/constants/ticketStatus';
import { useSupervisorAssignment } from '../hooks/useSupervisorAssignment';
import TechnicianRegistrationForm from './TechnicianRegistrationForm';

const formatDate = (value) =>
  new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

export default function SupervisorAssignmentDashboard() {
  const {
    tickets,
    technicians,
    selectedTicket,
    selectedTechnicianId,
    setSelectedTechnicianId,
    isForceAssignmentMode,
    showTechniciansAtCapacity,
    loadingTickets,
    loadingTechnicians,
    assigning,
    error,
    success,
    selectTicket,
    assignSelectedTicket,
    refresh
  } = useSupervisorAssignment();

  return (
    <main className="supervisor-assignment-dashboard">
      <section className="supervisor-assignment-header">
        <div>
          <span className="eyebrow">Portal de supervisor</span>
          <h1>Asignación inteligente de tickets</h1>
          <p>
            Selecciona un ticket abierto y asígnalo a un técnico especializado
            con capacidad disponible.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={refresh}
          disabled={loadingTickets}
        >
          Actualizar tickets
        </button>
      </section>

      {success && <p className="notice success">{success}</p>}
      {error && <p className="notice error">{error}</p>}

      <section className="assignment-layout">
        <section className="assignment-panel">
          <h2>Tickets abiertos</h2>

          {loadingTickets ? (
            <p className="muted">Cargando tickets abiertos...</p>
          ) : tickets.length === 0 ? (
            <p className="empty-state">
              No hay tickets abiertos pendientes de asignación.
            </p>
          ) : (
            <div className="assignment-ticket-list">
              {tickets.map(ticket => {
                const priority = TICKET_PRIORITIES[ticket.priority];

                return (
                  <button
                    key={ticket.id}
                    className={`assignment-ticket ${
                      selectedTicket?.id === ticket.id
                        ? 'assignment-ticket-selected'
                        : ''
                    }`}
                    onClick={() => selectTicket(ticket)}
                  >
                    <div className="ticket-heading">
                      <h3>{ticket.title}</h3>
                      <small>{formatDate(ticket.creationDate)}</small>
                    </div>

                    <div className="ticket-badges">
                      <Badge
                        text={ticket.category}
                        bgVar="--primary-light"
                        textVar="--primary"
                      />

                      <Badge
                        text={`Prioridad: ${
                          priority?.label || ticket.priority
                        }`}
                        bgVar={priority?.bgVar}
                        textVar={priority?.textVar}
                      />
                    </div>

                    <small>
                      Vence: <strong>{formatDate(ticket.limitDateSla)}</strong>
                    </small>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="assignment-panel">
          <h2>Técnico disponible</h2>

          {!selectedTicket ? (
            <p className="empty-state">
              Selecciona un ticket para consultar técnicos disponibles.
            </p>
          ) : (
            <>
              <p className="selected-ticket-description">
                Ticket seleccionado: <strong>{selectedTicket.title}</strong>
                <br />
                Categoría requerida: <strong>{selectedTicket.category}</strong>
              </p>

              {loadingTechnicians ? (
                <p className="muted">Buscando técnicos con cupo...</p>
                ) : technicians.length === 0 ? (
                isForceAssignmentMode ? (
                    <p className="notice error">
                    No hay técnicos especializados para esta categoría.
                    </p>
                ) : (
                    <>
                    <p className="notice error">
                        No hay técnicos especializados disponibles con cupo libre.
                    </p>

                    <button
                        className="secondary-button"
                        onClick={showTechniciansAtCapacity}
                    >
                        Ver técnicos para asignación forzada
                    </button>
                    </>
                )
                ) : (
                <>
                {isForceAssignmentMode && (
                <p className="notice error">
                    Asignación forzada: el técnico seleccionado no tiene cupo disponible.
                </p>
                )}
                  <label className="assignment-label">
                    Selecciona un técnico
                    <select
                      value={selectedTechnicianId}
                      onChange={event =>
                        setSelectedTechnicianId(event.target.value)
                      }
                    >
                      <option value="">Selecciona una opción</option>

                      {technicians.map(technician => (
                        <option
                          key={technician.id}
                          value={technician.id}
                        >
                            {technician.fullName} —{' '}
                            {technician.availableCapacity > 0
                            ? `disponibles: ${technician.availableCapacity}`
                            : `sin cupo (${technician.activeTickets}/${technician.maxOpenTickets})`}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    className="primary-button"
                    onClick={() => assignSelectedTicket(isForceAssignmentMode)}
                    disabled={assigning || !selectedTechnicianId}
                  >
                    {assigning
                        ? 'Asignando ticket...'
                        : isForceAssignmentMode
                            ? 'Forzar asignación'
                            : 'Confirmar asignación'}
                  </button>
                </>
              )}
            </>
          )}
        </section>
      </section>
      <section className="technician-registration-section">
    <TechnicianRegistrationForm />
    </section>
    </main>
  );
}