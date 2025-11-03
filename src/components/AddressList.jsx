import { useMemo } from 'react'

export default function AddressList({ addresses, onEdit, onDelete, onSetDefault }) {
  const list = useMemo(() => Array.isArray(addresses) ? addresses : [], [addresses])

  if (!list.length) {
    return (
      <div
        style={{
          backgroundColor: 'var(--white)',
          boxShadow: 'var(--shadow)',
          borderRadius: 'var(--border-radius)',
          padding: '1.25rem',
          color: 'var(--text-light)'
        }}
      >
        No tienes direcciones guardadas.
      </div>
    )
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
      {list.map(addr => (
        <li
          key={addr.id}
          style={{
            backgroundColor: 'var(--white)',
            boxShadow: 'var(--shadow)',
            borderRadius: 'var(--border-radius)',
            padding: '1rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>
              {addr.calle} {addr.numero}
              {addr.esPrincipal ? ' • Principal' : ''}
            </div>
            <div style={{ color: 'var(--text-light)' }}>
              {addr.localidad}, {addr.provincia}, {addr.pais} ({addr.codigoPostal})
            </div>
            {addr.observaciones && <div style={{ color: 'var(--text-light)' }}>{addr.observaciones}</div>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!addr.esPrincipal && (
              <button className="btn btn-outline" onClick={() => onSetDefault?.(addr)}>
                Marcar como principal
              </button>
            )}
            <button className="btn btn-outline" onClick={() => onEdit?.(addr)}>
              Editar
            </button>
            <button className="btn btn-danger" onClick={() => onDelete?.(addr)}>
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}


