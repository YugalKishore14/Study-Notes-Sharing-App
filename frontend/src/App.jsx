import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './admin/componentes/login&signup/LoginSignup';
import Admin from './admin/Pages/Admin/Admin';
import ProtectedRoute from './admin/ProtectedRoute';
import Home from './components/pages/home/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/home/*" element={<Home />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
