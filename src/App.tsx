import { Routes, Route } from "react-router-dom";
import { AppShellHeader } from "./components/AppShellHeader";
import { LoadingOverlay } from "@mantine/core";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { store } from "./store";
import { AdmissionsPage } from "./pages/AdmissionsPage";
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
import { StudentActivitiesPage } from "./pages/StudentActivities";
import { MediaPage } from "./pages/MediaPage";
import { CenterOfExcellencePage } from "./pages/CenterOfExcellence";
import { CenterOfCompetenciesPage } from "./pages/CenterOfCompetencies";
import { GalleryPage } from "./pages/GalleryPage";
import { TopCertificationPage } from "./pages/TopCertificationPage";
import { InnovativeClubsPage } from "./pages/innovativeClubs";
import { FeePaymentPage } from "./pages/FeePayment";
import { StudentAchievementsPage } from "./pages/StudentAchievements";
import ResearchPatents from "./pages/research/ResearchPage";
import ResearchPatentForm from "./pages/research/researchForm";
import { KeyExecutivesPage } from "./pages/keyExecutive";

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
            <Route path="/research" >
              <Route index element={<ResearchPatents />} />
              <Route path="add" element={<ResearchPatentForm />} />
              <Route path="edit/:patentId" element={<ResearchPatentForm />} />
            </Route>
            <Route path="/key-executives" element={<KeyExecutivesPage />} />
            <Route path="/campus-life" element={<CampusLifePage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/student-activities" element={<StudentActivitiesPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/center-of-excellence" element={<CenterOfExcellencePage />} />
            <Route path="/center-of-competencies" element={<CenterOfCompetenciesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/top-certification" element={<TopCertificationPage />} />
            <Route path="/innovative-clubs" element={<InnovativeClubsPage />} />
            <Route path="/fee-payment-curricular" element={<FeePaymentPage />} />
            {/* <Route path="/examination-curriculars" element={<Exam />} /> */}
            <Route path="/student-achievements" element={<StudentAchievementsPage />} />
          </Routes>
        </AppShellHeader>
      </div>
    </div>
  );
}

export default App;


