import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('El email es requerido')
      return
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El email no es válido')
      return
    }

    setError('')
    setLoading(true)
    try {
      // Verifica en db.json si el usuario existe
      const response = await axios.get(`http://localhost:5000/users?email=${email}`)

      if (response.data.length === 0) {
        setError('El correo no está registrado')
        setSuccess(false)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }  

  return (
    <div className="auth-page">
      <div className="auth-containerForgot">
        <div className="auth-cardForgot">
          <h1 className="auth-titleForgot">¿Olvidaste tu contraseña?</h1>
          <p className="auth-subtitle">
            Ingresá tu email y te enviaremos instrucciones para restablecerla.
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Te enviamos un correo a <strong>{email}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input ${error ? 'error' : ''}`}
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="btnSubmit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <p className="auth-footer">
            <Link to="/login" className="auth-link">
              ← Volver al login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
