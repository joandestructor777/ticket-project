import React, { useState } from 'react';
import TechnicianTicketCard from './TechnicianTicketCard';
import { useTechnicianTickets } from '../hooks/useTechnicianTickets';

const technicianStorageKey = 'helpdesk.technician-id';

function isGuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

export default function TechnicianDashboard() {
  const [technicianInput, setTechnicianInput] = useState(
    () => sessionStorage.getItem(technicianStorageKey) || ''
  );

  const [technicianId, setTechnicianId] = useState(
    () => sessionStorage.getItem(technicianStorageKey) || ''
  );

  const [configurationError, setConfigurationError] = useState('');

  const {
    tickets,
    loading,
    actionTicketId,
    error,
    success,
    loadTickets,
    startProcess,
    addProgressComment,
    resolve,
    close
  } = useTechnicianTickets(technicianId);

  const connectTechnician = event => {
    event.preventDefault();

    const normalizedId = technicianInput.trim();

    if (!isGuid(normalizedId)) {
      setConfigurationError(
        'Ingresa un identificador de técnico válido.'
      );
      return;
    }

    sessionStorage.setItem(technicianStorageKey, normalizedId);
    setConfigurationError('');
    setTechnicianId(normalizedId);
  };

  const ignoreActionError = operation => {
    operation.catch(() => {
      // El hook muestra el error recibido desde la API.
    });
  };

  return (
    <main className="technician-dashboard">
      <section className="technician-dashboard-header">
        <div>
          <span className="eyebrow">Portal técnico</span>
          <h1>Gestión de atención técnica</h1>
          <p>
            Consulta tus tickets asignados, documenta avances y registra
            soluciones.
          </p>
        </div>

        {technicianId && (
          <button
            className="secondary-button"
            onClick={loadTickets}
            disabled={loading}
          >
            Actualizar tickets
          </button>
        )}
      </section>

      <section className="technician-identity-card">
        <h2>Identificación del técnico</h2>

        <p className="muted">
          Para esta demostración, ingresa el ID del técnico asignado.
          En un sistema con autenticación, este dato vendría del inicio de
          sesión.
        </p>

        <form onSubmit={connectTechnician}>
          <label>
            ID del técnico
            <input
              value={technicianInput}
              onChange={event =>
                setTechnicianInput(event.target.value)
              }
              placeholder="Ejemplo: 259606f8-..."
            />
          </label>

          <button className="primary-button" type="submit">
            Ver mis tickets
          </button>
        </form>

        {configurationError && (
          <p className="notice error">{configurationError}</p>
        )}
      </section>

      {success && <p className="notice success">{success}</p>}
      {error && <p className="notice error">{error}</p>}

      {!technicianId ? (
        <p className="empty-state">
          Ingresa tu identificador para consultar los tickets asignados.
        </p>
      ) : loading ? (
        <p className="muted">Cargando tickets asignados...</p>
      ) : tickets.length === 0 ? (
        <p className="empty-state">
          No tienes tickets asignados actualmente.
        </p>
      ) : (
        <section className="technician-ticket-list">
          {tickets.map(ticket => (
            <TechnicianTicketCard
              key={ticket.id}
              ticket={ticket}
              actionTicketId={actionTicketId}
              onStartProcess={ticket =>
                ignoreActionError(startProcess(ticket))
              }
              onAddProgressComment={(ticket, content) =>
                ignoreActionError(
                  addProgressComment(ticket, content)
                )
              }
              onResolve={(ticket, content) =>
                ignoreActionError(resolve(ticket, content))
              }
              onClose={ticket =>
                ignoreActionError(close(ticket))
              }
            />
          ))}
        </section>
      )}
    </main>
  );
}