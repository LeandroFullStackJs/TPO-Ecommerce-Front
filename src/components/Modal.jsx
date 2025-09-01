// src/components/Modal.jsx
export default function Modal({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'var(--white)',
        padding: '2rem',
        borderRadius: 'var(--border-radius)',
        maxWidth: 400,
        width: '90%',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
      }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
          Debes iniciar sesión
        </h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-color)' }}>
          Para agregar productos al carrito y finalizar la compra, por favor inicia sesión.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={onLogin}
          >
            Ir a Iniciar Sesión
          </button>
          <button
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}