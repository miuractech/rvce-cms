 import { Button, Group, Box, Table, ActionIcon } from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { researchPatent } from "./researchForm";

export default function ResearchPatents() {
  const [patents, setPatents] = useState<researchPatent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "research"));
        const patentsData: researchPatent[] = [];
        querySnapshot.forEach((doc) => {
          patentsData.push({ ...doc.data(), id: doc.id } as researchPatent);
        });
        setPatents(patentsData);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch patents",
          color: "red",
        });
      }
    };

    fetchPatents();
  }, []);

  const handleDelete = async (patentId: string) => {
    if (window.confirm("Are you sure you want to delete this patent?")) {
      try {
        await deleteDoc(doc(db, "research", patentId));
        setPatents(patents.filter(patent => patent.id !== patentId));
        notifications.show({
          title: "Success",
          message: "Patent deleted successfully",
          color: "green"
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to delete patent",
          color: "red"
        });
      }
    }
  };

  return (
    <Box>
      <Group justify="flex-end" mb="md">
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={() => navigate("/research/add")}
        >
          Add Patent
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Serial Number</Table.Th>
            <Table.Th>Patent Application</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Patent Publication</Table.Th>
            <Table.Th>Inventors</Table.Th>
            <Table.Th>Invention Title</Table.Th>
            <Table.Th>Date of Filing</Table.Th>
            <Table.Th>Date of Grant</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {patents.map((patent) => (
            <Table.Tr key={patent.id}>
              <Table.Td>{patent.sl}</Table.Td>
              <Table.Td>{patent.patentApplication}</Table.Td>
              <Table.Td>{patent.status}</Table.Td>
              <Table.Td>{patent.patentPublication}</Table.Td>
              <Table.Td>{patent.inventors}</Table.Td>
              <Table.Td>{patent.inventionTitle}</Table.Td>
              <Table.Td>
                {patent.dateOfFiling 
                  ? new Date(patent.dateOfFiling).toLocaleDateString()
                  : "-"}
              </Table.Td>
              <Table.Td>
                {patent.dateOfGrant
                  ? new Date(patent.dateOfGrant).toLocaleDateString()
                  : "-"}
              </Table.Td>
              <Table.Td>
                <Group gap={8}>
                  <ActionIcon
                    color="blue"
                    onClick={() => navigate(`/research/edit/${patent.id}`)}
                  >
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={() => handleDelete(patent.id as string)}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
