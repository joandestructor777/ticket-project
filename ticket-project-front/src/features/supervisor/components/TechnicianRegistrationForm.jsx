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
    setForm(currentForm => {
      const hasCategory = currentForm.specialties.includes(category);

      return {
        ...currentForm,
        specialties: hasCategory
          ? currentForm.specialties.filter(
              specialty => specialty !== category
            )
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
    <section className="technician-registration">
      <h2>Registrar técnico</h2>

      <form onSubmit={handleSubmit}>
        <label className="assignment-label">
          Nombre completo
          <input
            type="text"
            value={form.fullName}
            maxLength="150"
            required
            onChange={event =>
              setForm(currentForm => ({
                ...currentForm,
                fullName: event.target.value
              }))
            }
          />
        </label>

        <label className="assignment-label">
          Máximo de tickets abiertos
          <input
            type="number"
            min="1"
            max="50"
            value={form.maxOpenTickets}
            required
            onChange={event =>
              setForm(currentForm => ({
                ...currentForm,
                maxOpenTickets: event.target.value
              }))
            }
          />
        </label>

        <fieldset className="specialties-fieldset">
          <legend>Especialidades</legend>

          {categories.map(category => (
            <label key={category} className="specialty-option">
              <input
                type="checkbox"
                checked={form.specialties.includes(category)}
                onChange={() => handleSpecialtyChange(category)}
              />
              {category}
            </label>
          ))}
        </fieldset>

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Registrando técnico...' : 'Registrar técnico'}
        </button>
      </form>

      {success && <p className="notice success">{success}</p>}
      {error && <p className="notice error">{error}</p>}
    </section>
  );
}