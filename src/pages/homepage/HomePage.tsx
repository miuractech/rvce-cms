import {
  Box,
} from "@mantine/core";
import { SectionsPage } from "./SectionsPage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

export function HomePage() {
  const [homepageData, setHomepageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const docRef = doc(db, "cms", "homepage");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHomepageData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box p="md">
      <SectionsPage data={homepageData} />
    </Box>
  );
}
