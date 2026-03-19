import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'      // ← remove { }
import Signup from './pages/Signup'    // ← remove { }
import ProtectedRoute from './components/ProtectedRoute'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />

       <Route path="/profile" element={           
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App