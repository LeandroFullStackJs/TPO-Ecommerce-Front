import { useState } from "react";
import { useUser   } from "../context/UserContext"; // Teoría: Hook de Contexto para acceso global al estado del usuario.
import { useOrders } from "../context/OrderContext";
import { useWishlist } from "../context/WishlistContext";

// Componente Perfil: muestra datos del usuario y permite editar nombre y email
function Perfil({ user }) {
  // Teoría: Acceso a función para actualizar usuario desde contexto
  const { updateUser   } = useUser  ();
  // Teoría: Estado Local (useState)
  // Se utilizan estados locales para manejar los valores de los campos del formulario.
  // Esto permite que los campos sean controlados por React y se actualicen dinámicamente.
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [message, setMessage] = useState(null); // Estado para mensajes de éxito/error.
  const [loading, setLoading] = useState(false);

  // Funcionamiento: Manejo del envío del formulario
  // Previene el comportamiento por defecto del formulario (recarga de página).
  // Llama a la función updateUser  para actualizar datos en backend/contexto.
  // Muestra mensajes de éxito o error según resultado.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await updateUser  ({ firstName, lastName, email });
      setMessage({ type: "success", text: "Perfil actualizado correctamente." });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Error al actualizar perfil." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="tab-perfil">
      <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
        Perfil
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--white)",
          boxShadow: "var(--shadow)",
          borderRadius: "var(--border-radius)",
          padding: "2rem",
          maxWidth: 700,
        }}
      >
        {/* Funcionamiento: Renderizado condicional de mensajes */}
        {/* Muestra un div de mensaje si 'message' no es nulo, aplicando estilos de éxito o error. */}
        {message && (
          <div
            className={message.type === "success" ? "success-message" : "error-message"}
            style={{ marginBottom: "1rem" }}
          >
            {message.text}
          </div>
        )}
        {/* Funcionamiento: Campos de formulario controlados */}
        {/* Los inputs están vinculados a los estados locales (firstName, lastName, email) */}
        {/* y se actualizan con 'onChange', lo que los convierte en "componentes controlados". */}
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="firstName">Nombre</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="lastName">Apellido</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* Botón deshabilitado mientras se procesa la petición */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}

// Componente MisCompras: muestra historial de órdenes o mensajes según estado
function MisCompras() {
  // Teoría: Acceso a órdenes y estados de carga/error desde contexto
  const { orders, loadingOrders, errorOrders } = useOrders();

  // Funcionamiento: Mostrar mensaje mientras se cargan las órdenes
  if (loadingOrders) {
    return (
      <section aria-labelledby="tab-compras">
        <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
          Mis Compras
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-light)" }}>
          Cargando historial de compras...
        </p>
      </section>
    );
  }

  // Funcionamiento: Mostrar mensaje de error si falla la carga
  if (errorOrders) {
    return (
      <section aria-labelledby="tab-compras">
        <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
          Mis Compras
        </h1>
        <p className="error-message" style={{ textAlign: "center" }}>
          {errorOrders}
        </p>
      </section>
    );
  }

  // Funcionamiento: Mostrar mensaje si no hay órdenes
  if (orders.length === 0) {
    return (
      <section aria-labelledby="tab-compras">
        <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
          Mis Compras
        </h1>
        <div
          style={{
            backgroundColor: "var(--white)",
            boxShadow: "var(--shadow)",
            borderRadius: "var(--border-radius)",
            padding: "2rem",
            maxWidth: 700,
            minHeight: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-light)",
            fontStyle: "italic",
          }}
        >
          Aquí aparecerá el historial de tus pedidos cuando realices alguna compra.
        </div>
      </section>
    );
  }

  // Funcionamiento: Renderizado de la lista de órdenes con detalles
  return (
    <section aria-labelledby="tab-compras">
      <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
        Mis Compras
      </h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div
            key={order.id}
            className="order-card"
            style={{
              backgroundColor: "var(--white)",
              boxShadow: "var(--shadow)",
              borderRadius: "var(--border-radius)",
              padding: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem", color: "var(--primary-color)" }}>
              Orden #{order.id} - {new Date(order.date).toLocaleDateString()}
            </h3>
            <p style={{ marginBottom: "1rem", color: "var(--text-light)" }}>
              Total: ${order.total.toLocaleString('es-AR')} - Estado: {order.status}
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    borderBottom: "1px dashed var(--border-color)",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "1rem" }}
                  />
                  <span>
                    {item.name} ({item.quantity} unid.)
                  </span>
                  <span style={{ marginLeft: "auto", fontWeight: "600" }}>
                    ${(item.price * item.quantity).toLocaleString('es-AR')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// Componente Configuracion: formulario para cambiar contraseña
function Configuracion() {
  // Teoría: Acceso a función para cambiar contraseña desde contexto
  const { changePassword } = useUser  ();
  // Estados locales para campos de contraseña y mensajes
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Funcionamiento: Validación y envío del formulario de cambio de contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validaciones básicas
    if (newPass !== confirmPass) {
      setMessage({ type: "error", text: "Las nuevas contraseñas no coinciden." });
      return;
    }
    if (newPass.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPass, newPass);
      setMessage({ type: "success", text: "Contraseña actualizada correctamente." });
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Error al cambiar contraseña." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="tab-configuracion">
      <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
        Configuración
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--white)",
          boxShadow: "var(--shadow)",
          borderRadius: "var(--border-radius)",
          padding: "2rem",
          maxWidth: 700,
        }}
      >
        {/* Renderizado condicional de mensajes */}
        {message && (
          <div
            className={message.type === "success" ? "success-message" : "error-message"}
            style={{ marginBottom: "1rem" }}
          >
            {message.text}
          </div>
        )}
        {/* Campos controlados para contraseñas */}
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="currentPass">Contraseña actual</label>
          <input
            id="currentPass"
            type="password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="newPass">Nueva contraseña</label>
          <input
            id="newPass"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="confirmPass">Confirmar nueva contraseña</label>
          <input
            id="confirmPass"
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {/* Botón deshabilitado mientras se procesa la petición */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </form>
    </section>
  );
}

  // Componente Wishlist: muestra la lista de productos favoritos del usuario
function Wishlist() {
  // Teoría: Acceso a la wishlist y función para eliminar productos desde contexto
  // Suponiendo que existe un contexto de usuario con 'wishlist' y 'removeFromWishlist'
  const { wishlist, removeFromWishlist } = useWishlist();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Funcionamiento: Eliminar producto de la wishlist
  const handleRemove = async (productId) => {
    setLoading(true);
    setMessage(null);
    try {
      await removeFromWishlist(productId);
      setMessage({ type: "success", text: "Producto eliminado de tu wishlist." });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Error al eliminar producto." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="tab-wishlist">
      <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>
        Wishlist
      </h1>
      {/* Renderizado condicional de mensajes */} 
      {message && (
        <div
          className={message.type === "success" ? "success-message" : "error-message"}
          style={{ marginBottom: "1rem" }}
        >
          {message.text}
        </div>
      )}
      {/* Mostrar mensaje si la wishlist está vacía */} 
      {(!wishlist || wishlist.length === 0) ? (
        <div
          style={{
            backgroundColor: "var(--white)",
            boxShadow: "var(--shadow)",
            borderRadius: "var(--border-radius)",
            padding: "2rem",
            maxWidth: 700,
            minHeight: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-light)",
            fontStyle: "italic",
          }}
        >
          Tu wishlist está vacía.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, maxWidth: 700 }}>
          {wishlist.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                backgroundColor: "var(--white)",
                boxShadow: "var(--shadow)",
                borderRadius: "var(--border-radius)",
                padding: "1rem",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "1rem",
                }}
              />
              <span style={{ flex: 1 }}>{item.name}</span>
              <button
                className="btn btn-danger"
                onClick={() => handleRemove(item.id)}
                disabled={loading}
                style={{ marginLeft: "1rem" }}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Componente principal MyAccountPage
export default function MyAccountPage() {
  // Teoría: Consumo de Contexto
  // 'useUser ()' hook permite acceder al objeto 'user' del contexto,
  // que contiene la información del usuario autenticado.
  const { user } = useUser  ();
  // Teoría: Estado para la navegación por pestañas
  // 'activeTab' controla qué componente (Perfil, MisCompras, Configuracion) se renderiza.
  const [activeTab, setActiveTab] = useState("perfil");

  // Funcionamiento: Protección de ruta
  // Si no hay un usuario autenticado, se muestra un mensaje y se evita renderizar el resto de la página.
  if (!user) {
    return (
      <p className="error-message" style={{ padding: "1rem", textAlign: "center" }}>
        Debes iniciar sesión para acceder a tu cuenta.
      </p>
    );
  }

  return (
    <div
      className="my-account-container"
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--light-gray)",
      }}
    >
      {/* Funcionamiento: Sidebar de navegación */}
      {/* Contiene botones que, al hacer clic, actualizan el estado 'activeTab', */}
      {/* lo que a su vez cambia el contenido principal. */}
      <aside
        className="my-account-sidebar"
        style={{
          width: 250,
          backgroundColor: "var(--white)",
          boxShadow: "var(--shadow)",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          borderRight: "1px solid var(--border-color)",
          fontFamily: "var(--font-primary)",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "2rem",
            color: "var(--primary-color)",
          }}
        >
          Mi Cuenta
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem", flexGrow: 1 }}>
          {[
            { id: "perfil", label: "Perfil" },
            { id: "compras", label: "Mis Compras" },
            { id: "configuracion", label: "Configuración" },
            {id: "wishlist", label: "Wishlist" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`btn btn-outline ${activeTab === id ? "btn-primary" : ""}`}
              aria-selected={activeTab === id}
              role="tab"
              tabIndex={activeTab === id ? 0 : -1}
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                borderRadius: "var(--border-radius)",
                fontWeight: activeTab === id ? "700" : "500",
                cursor: "pointer",
                transition: "var(--transition)",
                borderColor: activeTab === id ? "var(--accent-color)" : "var(--border-color)",
                backgroundColor: activeTab === id ? "var(--accent-color)" : "transparent",
                color: activeTab === id ? "var(--white)" : "var(--text-color)",
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Funcionamiento: Contenido principal de las pestañas */}
      {/* Renderiza condicionalmente el componente correspondiente a la pestaña activa. */}
      {/* Se pasa el objeto 'user' al componente 'Perfil' para que pueda mostrar y editar los datos. */}
      <main
        className="my-account-content"
        style={{
          flex: 1,
          padding: "2rem 3rem",
          overflowY: "auto",
          maxHeight: "100vh",
          fontFamily: "var(--font-primary)",
        }}
        role="tabpanel"
      >
        {/* Renderiza la pestaña activa */}
        {activeTab === "perfil" && <Perfil user={user} />}
        {activeTab === "compras" && <MisCompras />}
        {activeTab === "configuracion" && <Configuracion />}
        {activeTab === "wishlist" && <Wishlist />}
      </main>
    </div>
  );
}