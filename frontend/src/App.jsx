import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import useWallet from './hooks/useWallet';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import UploadPaper from './pages/admin/UploadPaper';
import GrantAccess from './pages/admin/GrantAccess';
import PaperDetails from './pages/admin/PaperDetails';
import AuditLog from './pages/admin/AuditLog';
import StudentDashboard from './pages/student/StudentDashboard';
import RetrievePaper from './pages/student/RetrievePaper';

function AppRoutes() {
  const wallet = useWallet();

  return (
    <Routes>
      <Route element={<Layout wallet={wallet} />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/upload" element={<ProtectedRoute requiredRole="admin"><UploadPaper /></ProtectedRoute>} />
        <Route path="/admin/grant-access" element={<ProtectedRoute requiredRole="admin"><GrantAccess /></ProtectedRoute>} />
        <Route path="/admin/papers/:examName" element={<ProtectedRoute requiredRole="admin"><PaperDetails /></ProtectedRoute>} />
        <Route path="/admin/audit-log" element={<ProtectedRoute requiredRole="admin"><AuditLog /></ProtectedRoute>} />

        <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/retrieve" element={<ProtectedRoute requiredRole="student"><RetrievePaper /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
