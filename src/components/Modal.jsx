// src/components/Modal.jsx
export default function Modal({ isOpen, onClose, onLogin }) {
  // Teoría: Renderizado Condicional
  // El componente Modal solo se renderiza si la prop 'isOpen' es verdadera.
  // Esto es una práctica común para controlar la visibilidad de elementos UI.
  if (!isOpen) return null

  return (
    // Funcionamiento: Contenedor principal del modal
    // Este div actúa como un 'overlay' o fondo oscuro que cubre toda la pantalla.
    // Su estilo 'position: fixed' y 'top/left/right/bottom: 0' asegura que ocupe el 100% del viewport.
    // 'backgroundColor: rgba(0,0,0,0.5)' crea un efecto de oscurecimiento semitransparente.
    // 'display: flex', 'justifyContent: center', 'alignItems: center' centran el contenido del modal.
    // 'zIndex: 1000' asegura que el modal esté por encima de la mayoría de los otros elementos de la página.
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      {/* Funcionamiento: Contenido del modal */}
      {/* Este div contiene el contenido visible del modal (título, mensaje, botones). */}
      {/* Sus estilos definen la apariencia del cuadro del modal: fondo blanco, padding, bordes redondeados, sombra. */}
      {/* 'maxWidth' y 'width' aseguran que sea responsivo pero no demasiado grande. */}
      <div style={{
        backgroundColor: 'var(--white)',
        padding: '2rem',
        borderRadius: 'var(--border-radius)',
        maxWidth: 400,
        width: '90%',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
      }}>
        {/* Teoría: Props y Comunicación entre Componentes */}
        {/* Las props 'onLogin' y 'onClose' son funciones pasadas desde el componente padre. */}
        {/* Esto permite que el modal, un componente hijo, notifique al padre sobre eventos (clics en botones). */}
        {/* Funcionamiento: Botón "Ir a Iniciar Sesión" */}
        {/* Al hacer clic, llama a la función 'onLogin' pasada como prop. */}
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
          {/* Funcionamiento: Botón "Cancelar" */}
          {/* Al hacer clic, llama a la función 'onClose' pasada como prop, que típicamente cierra el modal. */}
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