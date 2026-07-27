import React, { useState } from 'react';
import { supervisorAssignmentService } from '../services/supervisorAssignmentService';

const categories = ['Hardware', 'Software', 'Red', 'Otro'];

const initialForm = {
  fullName: '',
  maxOpenTickets: 5,
  specialties: []
};

export default function TechnicianRegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSpecialtyChange = (category) => {
    setForm((currentForm) => {
      const hasCategory = currentForm.specialties.includes(category);
      return {
        ...currentForm,
        specialties: hasCategory
          ? currentForm.specialties.filter((specialty) => specialty !== category)
          : [...currentForm.specialties, category]
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await supervisorAssignmentService.createTechnician({
        fullName: form.fullName,
        maxOpenTickets: Number(form.maxOpenTickets),
        specialties: form.specialties
      });

      setSuccess('El técnico ha sido registrado correctamente.');
      setForm(initialForm);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="ticket-form" style={{ maxWidth: '600px' }}>
      <h2>Registrar técnico</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label>
          Nombre completo
          <input
            type="text"
            value={form.fullName}
            maxLength="150"
            placeholder="Ej. Juan Pérez"
            required
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                fullName: e.target.value
              }))
            }
          />
        </label>

        <label>
          Máximo de tickets abiertos
          <input
            type="number"
            min="1"
            max="50"
            value={form.maxOpenTickets}
            required
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                maxOpenTickets: e.target.value
              }))
            }
          />
        </label>

        <fieldset style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '12px 16px' }}>
          <legend style={{ fontSize: '0.85rem', fontWeight: '600', padding: '0 6px', color: 'var(--text-main)' }}>
            Especialidades
          </legend>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
            {categories.map((category) => (
              <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.specialties.includes(category)}
                  onChange={() => handleSpecialtyChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Registrando técnico...' : 'Registrar técnico'}
        </button>
      </form>

      {success && <p className="notice success" style={{ margin: 0 }}>{success}</p>}
      {error && <p className="notice error" style={{ margin: 0 }}>{error}</p>}
    </section>
  );
}