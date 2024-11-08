import { Flex } from "@mantine/core";
import { useState, useEffect } from "react";
import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { notifications } from "@mantine/notifications";
import { DepartmentSection } from "./department";

export type IdepartmentStatus = "published" | "unpublished";

export interface DepartmentData {
  id: string;
  title: string;
  description: string;
  image: string;
  status: IdepartmentStatus;
}

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "departments"));
        const departmentsData: DepartmentData[] = [];
        querySnapshot.forEach((doc) => {
          departmentsData.push({ ...doc.data(), id: doc.id } as DepartmentData);
        });
        setDepartments(departmentsData);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch departments",
          color: "red",
        });
      }
    };

    fetchDepartments();
  }, []);

  return (
    <>
      <DepartmentSection
        data={{
          id: "",
          title: "",
          description: "",
          image: "",
          status: "unpublished",
        }}
        index={departments.length}
      />

      {/* <Group mb="md">
        <Button onClick={() => setModalOpened(true)}>
          Create New Department
        </Button>
      </Group> */}

      <Flex wrap={"wrap"} gap="xl">
        {departments.map((dept, index) => (
          <DepartmentSection key={index} data={dept} index={index} />
        ))}
      </Flex>
    </>
  );
}
