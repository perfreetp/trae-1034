import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Elderly from "@/pages/Elderly";
import Appointments from "@/pages/Appointments";
import Tasks from "@/pages/Tasks";
import Health from "@/pages/Health";
import Contacts from "@/pages/Contacts";
import Finance from "@/pages/Finance";
import Messages from "@/pages/Messages";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/elderly" element={
            <ProtectedRoute allowedRoles={['admin', 'worker', 'family']}>
              <Elderly />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute allowedRoles={['admin', 'worker']}>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute allowedRoles={['admin', 'worker']}>
              <Tasks />
            </ProtectedRoute>
          } />
          <Route path="/health" element={
            <ProtectedRoute allowedRoles={['admin', 'worker', 'family']}>
              <Health />
            </ProtectedRoute>
          } />
          <Route path="/contacts" element={
            <ProtectedRoute allowedRoles={['admin', 'worker']}>
              <Contacts />
            </ProtectedRoute>
          } />
          <Route path="/finance" element={
            <ProtectedRoute allowedRoles={['admin', 'family']}>
              <Finance />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute allowedRoles={['admin', 'family']}>
              <Messages />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}
