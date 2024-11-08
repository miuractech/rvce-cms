import { Routes, Route } from "react-router-dom";
import { AppShellHeader } from "./components/AppShellHeader";
import { LoadingOverlay } from "@mantine/core";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { store } from "./store";
import { AdmissionsPage } from "./pages/AdmissionsPage";
import { ResearchPage } from "./pages/ResearchPage";
import { HomePage } from "./pages/homepage/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { DepartmentsPage } from "./pages/departments/Departments";
import { CampusLifePage } from "./pages/CampusLifePage";
import { PlacementsPage } from "./pages/PlacementsPage";
import { ContactPage } from "./pages/ContactPage";
import { BlogPage } from "./pages/BlogPage";
import { AuthPage } from "./pages/AuthPage";
import { useEffect } from "react";
import { DepartmentPage } from "./pages/departments/departmentPage";
import { AmenitiesPage } from "./pages/Amenities";

export function App() {
  const { user, setUser } = store();

  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, async (cred) => {
      setUser(cred);
    });
    return () => Unsubscribe();
  }, []);

  if (user === undefined) return <LoadingOverlay visible />;
  else if (!user) return <AuthPage />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      <div
        style={{
          flexGrow: 1,
          width: "100%",
          zIndex: 0,
        }}
      >
        <AppShellHeader>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/departments">
              <Route index element={<DepartmentsPage />} />
              <Route path=":depId" element={<DepartmentPage />} />
            </Route>
            <Route path="/amenities" element={<AmenitiesPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/campus-life" element={<CampusLifePage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </AppShellHeader>
      </div>
    </div>
  );
}

export default App;
