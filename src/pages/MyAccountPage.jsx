import { useState } from "react";
import { useUser  } from "../context/UserContext";

// Componente Perfil: muestra datos del usuario y permite editar nombre y email
function Perfil({ user }) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías llamar a tu API o contexto para actualizar datos
    setMessage({ type: "success", text: "Perfil actualizado correctamente." });
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
        {message && (
          <div
            className={
              message.type === "success" ? "success-message" : "error-message"
            }
            style={{ marginBottom: "1rem" }}
          >
            {message.text}
          </div>
        )}
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
        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>
    </section>
  );
}

// Componente MisCompras: muestra mensaje indicando que aquí aparecerán las compras
function MisCompras() {
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
        {/* Mensaje para cuando no hay compras */}
        Aquí aparecerá el historial de tus pedidos cuando realices alguna compra.
      </div>
    </section>
  );
}

// Componente Configuracion: formulario para cambiar contraseña
function Configuracion() {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setMessage({ type: "error", text: "Las nuevas contraseñas no coinciden." });
      return;
    }
    if (newPass.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    // Aquí deberías llamar a tu API o contexto para cambiar la contraseña
    setMessage({ type: "success", text: "Contraseña actualizada correctamente." });
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
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
        {message && (
          <div
            className={
              message.type === "success" ? "success-message" : "error-message"
            }
            style={{ marginBottom: "1rem" }}
          >
            {message.text}
          </div>
        )}
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
        <button type="submit" className="btn btn-primary">
          Cambiar contraseña
        </button>
      </form>
    </section>
  );
}

// Componente principal MyAccountPage
export default function MyAccountPage() {
  const { user } = useUser ();

  // Estado para pestaña activa
  const [activeTab, setActiveTab] = useState("perfil");

  // Si no hay usuario logueado, mostrar mensaje
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
      {/* Sidebar con navegación */}
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
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`btn btn-outline ${
                activeTab === id ? "btn-primary" : ""
              }`}
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

      {/* Contenido principal con scroll */}
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
      </main>
    </div>
  );
}