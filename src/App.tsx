import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageProfile from "./pages/admin/ManageProfile";
import ManageFormations from "./pages/admin/ManageFormations";
import ManageSkills from "./pages/admin/ManageSkills";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageMessages from "./pages/admin/ManageMessages";
import ManageExperiences from "./pages/admin/ManageExperiences";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route index element={<Dashboard />} />
          <Route path="profil" element={<ManageProfile />} />
          <Route path="formations" element={<ManageFormations />} />
          <Route path="competences" element={<ManageSkills />} />
          <Route path="projets" element={<ManageProjects />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="experiences" element={<ManageExperiences />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}