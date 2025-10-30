import { useUser } from '../context/UserContext'

export default function DebugUserPage() {
  const { user, isAuthenticated, loading } = useUser()

  if (loading) {
    return <div>Cargando usuario...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🐛 Debug de Usuario</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Estado de Autenticación:</h2>
        <p><strong>isAuthenticated:</strong> {isAuthenticated ? '✅ Sí' : '❌ No'}</p>
        <p><strong>loading:</strong> {loading ? '⏳ Sí' : '✅ No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Datos del Usuario:</h2>
        <pre style={{ 
          background: '#f4f4f4', 
          padding: '15px', 
          borderRadius: '5px',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Verificaciones Específicas:</h2>
        <p><strong>user existe:</strong> {user ? '✅ Sí' : '❌ No'}</p>
        <p><strong>user.role:</strong> {user?.role || 'undefined'}</p>
        <p><strong>user.role === 'admin':</strong> {user?.role === 'admin' ? '✅ Sí' : '❌ No'}</p>
        <p><strong>user.rol:</strong> {user?.rol || 'undefined'}</p>
        <p><strong>user.rol === 'admin':</strong> {user?.rol === 'admin' ? '✅ Sí' : '❌ No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>LocalStorage:</h2>
        <pre style={{ 
          background: '#f4f4f4', 
          padding: '15px', 
          borderRadius: '5px',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {JSON.stringify({
            user: JSON.parse(localStorage.getItem('user') || 'null'),
            token: localStorage.getItem('token')
          }, null, 2)}
        </pre>
      </div>

      <div>
        <h2>Acciones de Debug:</h2>
        <button 
          onClick={() => console.log('Usuario completo:', user)}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          Log User en Console
        </button>
        <button 
          onClick={() => console.log('localStorage:', {
            user: localStorage.getItem('user'),
            token: localStorage.getItem('token')
          })}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          Log LocalStorage
        </button>
      </div>
    </div>
  )
}