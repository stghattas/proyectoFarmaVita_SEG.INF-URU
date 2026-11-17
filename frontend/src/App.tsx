import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estados de Autenticación
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Estados del Inventario
  const [inventario, setInventario] = useState<any[]>([]);
  const [nuevoMed, setNuevoMed] = useState({ nombre: '', lote: '', cantidad: 0, fechaVencimiento: '' });

  // Efecto para cargar datos apenas obtenemos el token
  useEffect(() => {
    if (token) {
      cargarInventario();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Credenciales inválidas en OpenLDAP');

      const data = await response.json();
      setToken(data.access_token);
      setRole(data.role);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const cargarInventario = async () => {
    try {
      const response = await fetch('/api/inventario', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInventario(data);
      }
    } catch (err) {
      console.error('Error al cargar inventario', err);
    }
  };

  const handleAgregarMed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inventario', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(nuevoMed),
      });

      if (response.ok) {
        cargarInventario(); // Refrescamos la tabla
        setNuevoMed({ nombre: '', lote: '', cantidad: 0, fechaVencimiento: '' }); // Limpiamos formulario
      }
    } catch (err) {
      console.error('Error al guardar', err);
    }
  };

  // VISTA 1: BÓVEDA (Con Token)
  if (token) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', backgroundColor: '#1e1e1e', borderRadius: '8px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
          <h2>🛡️ Inventario Farmacéutico Central</h2>
          <div>
            <span style={{ marginRight: '1rem', color: '#4caf50' }}>{username} ({role})</span>
            <button onClick={() => setToken(null)} style={{ padding: '0.5rem', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
          </div>
        </div>

        {/* Formulario de Ingreso */}
        <form onSubmit={handleAgregarMed} style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Medicamento (Ej: Ibuprofeno)" value={nuevoMed.nombre} onChange={e => setNuevoMed({...nuevoMed, nombre: e.target.value})} required style={{ flex: 1, padding: '0.5rem' }}/>
          <input type="text" placeholder="Lote (Ej: L-001)" value={nuevoMed.lote} onChange={e => setNuevoMed({...nuevoMed, lote: e.target.value})} required style={{ width: '120px', padding: '0.5rem' }}/>
          <input type="number" placeholder="Cant." value={nuevoMed.cantidad || ''} onChange={e => setNuevoMed({...nuevoMed, cantidad: Number(e.target.value)})} required style={{ width: '80px', padding: '0.5rem' }}/>
          <input type="date" value={nuevoMed.fechaVencimiento} onChange={e => setNuevoMed({...nuevoMed, fechaVencimiento: e.target.value})} required style={{ padding: '0.5rem' }}/>
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ingresar</button>
        </form>

        {/* Tabla de Base de Datos */}
        <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333', textAlign: 'left' }}>
              <th style={{ padding: '0.8rem' }}>ID</th>
              <th style={{ padding: '0.8rem' }}>Nombre</th>
              <th style={{ padding: '0.8rem' }}>Lote</th>
              <th style={{ padding: '0.8rem' }}>Cantidad</th>
              <th style={{ padding: '0.8rem' }}>Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map(med => (
              <tr key={med.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '0.8rem' }}>{med.id}</td>
                <td style={{ padding: '0.8rem' }}>{med.nombre}</td>
                <td style={{ padding: '0.8rem' }}>{med.lote}</td>
                <td style={{ padding: '0.8rem' }}>{med.cantidad}</td>
                <td style={{ padding: '0.8rem' }}>{med.fechaVencimiento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // VISTA 2: LOGIN ESTRICTO (Sin Token)
  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', backgroundColor: '#1a1a1a', borderRadius: '8px', color: 'white' }}>
      <h2 style={{ textAlign: 'center' }}>Acceso Intranet</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario LDAP" required style={{ padding: '0.8rem' }}/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required style={{ padding: '0.8rem' }}/>
        {error && <div style={{ color: '#ff4444', textAlign: 'center' }}>{error}</div>}
        <button type="submit" style={{ padding: '1rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>Autenticar</button>
      </form>
    </div>
  );
}

export default App;