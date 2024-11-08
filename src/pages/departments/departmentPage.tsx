import { Tabs, Box } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { AboutDeptSection } from "./sections/AboutDeptSection";
import { FacultySection } from "./sections/FacultySection";
import { AchievementsSection } from "./sections/AchievementsSection";
import { InfrastructureSection } from "./sections/InfrastructureSection";
import { IndustrySection } from "./sections/IndustrySection";
import { VTUResearchSection } from "./sections/VTUResearchSection";
import { EventsSection } from "./sections/EventsSection";
import { ResearchInitiativesSection } from "./sections/ResearchInitiativesSection";
import { PlacementsSection } from "./sections/PlacementsSection";
import { SchemeSyllabusSection } from "./sections/SchemeSyllabusSection";
import { CoCurricularSection } from "./sections/CoCurricularSection";

// About Department Section
export interface AboutDept {
  intro: {
    description: string;
    title: string;
    img: string;
  };
  vision: string;
  mission: string;
  objectives: string;
  highlights: string;
  departmentId:string;
}

// Faculty Member Section
export interface FacultyMember {
  name: string;
  image?: string;
  position?: string;
  title: string;
  specializations: string[];
  email: string;
  phone?: string;
  imageUrl?: string;
  socials?: { link: string; socialMedia: string; icon: React.ReactNode }[];
}

// Achievements Section
export interface Achievement {
  title: string;
  description: string;
  date: Date;
  awardType?: string;
  recipientName?: string;
}

// Infrastructure Section
export interface Infrastructure {
  facilities: string[];
}

// Industry Partnerships Section
export interface IndustryPartnership {
  partnerName: string;
  partnershipType: string;
  description: string;
  companyLogo?: string;
  startDate?: Date;
  endDate?: Date;
}

// VTU Research Center Section
export interface ResearchCenter {
  name: string;
  focusAreas: string[];
  description: string;
  establishedYear: number;
  affiliatedFaculty: string[];
}

// Research Initiatives Section
export interface ResearchInitiative {
  title: string;
  description: string;
  startDate: Date;
  fundingAgency: string;
  amountFunded?: number;
  associatedFaculty: string[];
}

// Placements Section
export interface Placement {
  companyName: string;
  jobRole: string;
  package: string;
  placementYear: number;
  studentsPlaced: number;
  recruitmentProcess: string;
}

// Events Section
export interface Event {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizers: string[];
  participantsCount?: number;
  eventType: string;
}

// Scheme and Syllabus Section
export interface SchemeAndSyllabus {
  programName: string;
  year: number;
  semester: number;
  syllabusUrl: string;
  creditDistribution: {
    theory: number;
    practical: number;
    project?: number;
  };
}

// Co-Curricular Activities Section
export interface CoCurricularActivity {
  title: string;
  description: string;
  activityType: string;
  frequency: string;
  facultyCoordinator?: string;
  studentParticipantsCount?: number;
}

export interface DepartmentPageData {
  about?: AboutDept;
  faculty?: FacultyMember[];
  achievements?: Achievement[];
  infrastructure?: Infrastructure;
  industry?: IndustryPartnership[];
  vtuResearch?: ResearchCenter;
  events?: Event[];
  researchInitiatives?: ResearchInitiative[];
  placements?: Placement[];
  schemeSyllabus?: SchemeAndSyllabus[];
  coCurricular?: CoCurricularActivity[];
}

export function DepartmentPage() {
  const { depId } = useParams();
  const [activeTab, setActiveTab] = useState<string | null>("aboutDept");
  const [departmentData, setDepartmentData] = useState<DepartmentPageData>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "departments", depId || ""),
      (docSnap) => {
        if (docSnap.exists()) {
          setDepartmentData(docSnap.data() as DepartmentPageData);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to department data:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [depId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical">
      <Tabs.List>
        <Tabs.Tab value="aboutDept">About Department</Tabs.Tab>
        <Tabs.Tab value="faculty">Faculty</Tabs.Tab>
        <Tabs.Tab value="achievements">Achievements</Tabs.Tab>
        <Tabs.Tab value="infrastructure">Infrastructure</Tabs.Tab>
        <Tabs.Tab value="industry">Industry</Tabs.Tab>
        <Tabs.Tab value="vtuResearch">VTU Research Center</Tabs.Tab>
        <Tabs.Tab value="events">Events</Tabs.Tab>
        <Tabs.Tab value="researchInitiatives">Research Initiatives</Tabs.Tab>
        <Tabs.Tab value="placements">Placements</Tabs.Tab>
        <Tabs.Tab value="schemeSyllabus">Scheme & Syllabus</Tabs.Tab>
        <Tabs.Tab value="coCurricular">Co-Curricular Activities</Tabs.Tab>
      </Tabs.List>

      <Box p="md">
        <Tabs.Panel value="aboutDept">
          <AboutDeptSection data={departmentData?.about} />
        </Tabs.Panel>
        <Tabs.Panel value="faculty">
          <FacultySection data={departmentData?.faculty || []} />
        </Tabs.Panel>
        <Tabs.Panel value="achievements">
          <AchievementsSection data={departmentData?.achievements || []} />
        </Tabs.Panel>
        <Tabs.Panel value="infrastructure">
          <InfrastructureSection data={departmentData?.infrastructure} />
        </Tabs.Panel>
        <Tabs.Panel value="industry">
          <IndustrySection data={departmentData?.industry || []} />
        </Tabs.Panel>
        <Tabs.Panel value="vtuResearch">
          <VTUResearchSection data={departmentData?.vtuResearch} />
        </Tabs.Panel>
        <Tabs.Panel value="events">
          <EventsSection data={departmentData?.events || []} />
        </Tabs.Panel>
        <Tabs.Panel value="researchInitiatives">
          <ResearchInitiativesSection
            data={departmentData?.researchInitiatives || []}
          />
        </Tabs.Panel>
        <Tabs.Panel value="placements">
          <PlacementsSection data={departmentData?.placements || []} />
        </Tabs.Panel>
        <Tabs.Panel value="schemeSyllabus">
          <SchemeSyllabusSection data={departmentData?.schemeSyllabus || []} />
        </Tabs.Panel>
        <Tabs.Panel value="coCurricular">
          <CoCurricularSection data={departmentData?.coCurricular || []} />
        </Tabs.Panel>
      </Box>
    </Tabs>
  );
}
