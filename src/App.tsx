import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/elderly" element={<Elderly />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/health" element={<Health />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
      </Routes>
    </Router>
  );
}
