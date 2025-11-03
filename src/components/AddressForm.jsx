import { useEffect, useState } from 'react'

export default function AddressForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    calle: '',
    numero: '',
    localidad: '',
    provincia: '',
    pais: 'Argentina',
    codigoPostal: '',
    observaciones: '',
    esPrincipal: false,
    usuarioId: undefined,
  })

  useEffect(() => {
    if (initialValue) {
      setForm(prev => ({ ...prev, ...initialValue }))
    }
  }, [initialValue])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(form)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
      <div className="form-group">
        <label>Calle</label>
        <input name="calle" value={form.calle} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Número</label>
        <input name="numero" value={form.numero} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Localidad</label>
        <input name="localidad" value={form.localidad} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Provincia</label>
        <input name="provincia" value={form.provincia} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>País</label>
        <input name="pais" value={form.pais} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Código Postal</label>
        <input name="codigoPostal" value={form.codigoPostal} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Observaciones (opcional)</label>
        <input name="observaciones" value={form.observaciones} onChange={handleChange} />
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input id="esPrincipal" type="checkbox" name="esPrincipal" checked={!!form.esPrincipal} onChange={(e) => setForm(prev => ({ ...prev, esPrincipal: e.target.checked }))} />
        <label htmlFor="esPrincipal">Usar como dirección principal</label>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button type="submit" className="btn btn-primary" disabled={!!submitting}>
          {submitting ? 'Guardando...' : 'Guardar dirección'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={!!submitting}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}


