//useState para crear y manejar estado local de un componente
import { useState } from 'react'
//podernavegar entre pestañas
import { Link, useNavigate } from 'react-router-dom'
//contexto de usuario, es en donde se maneja la autenticación y los datos del usuario es como el puente entre el srv y la bdd (simulada)
import { useUser } from '../context/UserContext'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useUser()//proviene del userContext, es donde obtenemos la funcion de login
  const navigate = useNavigate()

  const validateForm = () => {
    //aca almacenamos los errores que pueden surgir
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    //validamos longitud de la contraseña
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    //validamos que no haya errores
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    //evita recargo de pagina
    e.preventDefault()
    //validamos el formulario
    if (!validateForm()) return
    
    try {
      setLoading(true)
      //llamamos a la funcion login del Usercontext, que es en donde validamos la existencia del usuario
      await login(formData.email, formData.password)
      navigate('/home')
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    //obtenemos el nombre y valor del campo
    const { name, value } = e.target
    //actualizamos el estado del formulario, primero el email, luego la contraseña. ... es para no sobreescribir los valores
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }


  //aca comienza lo que seria el html, clases, estilos, etc
  return (
  <div className="auth-page">
    <div className="auth-containerLogin">
      <div className="auth-cardLogin">
        <h1 className="auth-titleLogin">Log In</h1>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="forgot-password">
              <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
          
          <button type="submit" className="btnSubmit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Submit'}
          </button>

          <div className="demo-credentials">
            <h4>Credenciales de la demo:</h4>
            <p><strong>Admin:</strong> adm@artGallery.com / adm123</p>
            <p><strong>Usuario:</strong> delfi@artGallery.com / delfi123</p>
          </div>
        </form>

        <p className="auth-footer">
          Don’t have an account?{' '}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  </div>
)
}
