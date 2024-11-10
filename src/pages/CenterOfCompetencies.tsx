import { useState, useEffect } from "react";
import { Box, Button, Container, Group, Tabs, Title } from "@mantine/core";
import { GenericCMS } from "../components/genericCMS";
import { useForm } from "@mantine/form";
import { ICMSInput } from "../components/genericCMSInputField";
import {
  doc,
  setDoc,
  updateDoc,
  deleteField,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { IconPencil, IconGripVertical } from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Define the form values for Center of Competencies sections
interface CenterOfCompetenciesPageFormValues {
  sections: {
    [key: string]: {
      content: ICMSInput[]; // This could be adjusted to fit competency details
      index: number;
    };
  };
}

export function CenterOfCompetenciesPage() {
  const [activeTab, setActiveTab] = useState<string | null>("competency1");
  const [isLoading, setIsLoading] = useState(true);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);

  const form = useForm<CenterOfCompetenciesPageFormValues>({
    initialValues: {
      sections: {},
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "cms", "centerOfCompetencies");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as CenterOfCompetenciesPageFormValues;
          form.setValues(data);
          // Sort sections by index
          const sections = Object.entries(data.sections)
            .sort(([, a], [, b]) => a.index - b.index)
            .map(([key]) => key);
          setSectionOrder(sections);
          if (sections.length > 0) {
            setActiveTab(sections[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching Center of Competencies page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: CenterOfCompetenciesPageFormValues) => {
    try {
      const docRef = doc(db, "cms", "centerOfCompetencies");
      await setDoc(docRef, values);
    } catch (error) {
      console.error("Error saving Center of Competencies page data:", error);
    }
  };

  const handleAddSection = async (sectionName: string) => {
    try {
      const docRef = doc(db, "cms", "centerOfCompetencies");
      const maxIndex = Object.values(form.values.sections).reduce(
        (max, section) => Math.max(max, section.index),
        -1
      );
      await updateDoc(docRef, {
        [`sections.${sectionName}`]: {
          content: [], // Adjust content structure for competency details
          index: maxIndex + 1,
        },
      });
      form.setFieldValue(`sections.${sectionName}`, {
        content: [],
        index: maxIndex + 1,
      });
      setSectionOrder([...sectionOrder, sectionName]);
      setActiveTab(sectionName);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const handleDeleteSection = async (sectionKey: string) => {
    try {
      const docRef = doc(db, "cms", "centerOfCompetencies");
      await updateDoc(docRef, {
        [`sections.${sectionKey}`]: deleteField(),
      });
      const newSections = { ...form.values.sections };
      delete newSections[sectionKey];
      form.setValues({ sections: newSections });
      const newOrder = sectionOrder.filter((key) => key !== sectionKey);
      setSectionOrder(newOrder);
      setActiveTab(newOrder[0] || null);
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleSectionUpdate = async (
    sectionKey: string,
    newValue: ICMSInput[]
  ) => {
    try {
      const docRef = doc(db, "cms", "centerOfCompetencies");
      await updateDoc(docRef, {
        [`sections.${sectionKey}.content`]: newValue,
      });
      form.setFieldValue(`sections.${sectionKey}.content`, newValue);
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newOrder = Array.from(sectionOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setSectionOrder(newOrder);

    // Update order in Firestore with new indices
    try {
      const docRef = doc(db, "cms", "centerOfCompetencies");
      const newSections: CenterOfCompetenciesPageFormValues["sections"] = {};
      newOrder.forEach((key, index) => {
        newSections[key] = {
          content: form.values.sections[key].content,
          index,
        };
      });
      await setDoc(docRef, { sections: newSections });
      form.setValues({ sections: newSections });
    } catch (error) {
      console.error("Error updating section order:", error);
    }
  };

  if (isLoading) {
    return <Container size="lg">Loading...</Container>;
  }

  return (
    <Container fluid>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <Tabs.List ref={provided.innerRef} {...provided.droppableProps}>
                  {sectionOrder.map((sectionKey, index) => (
                    <Draggable
                      key={sectionKey}
                      draggableId={sectionKey}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="w-full"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className="flex items-center ">
                            <div {...provided.dragHandleProps}>
                              <IconGripVertical size={16} />
                            </div>
                            <Tabs.Tab value={sectionKey} className="w-full">
                              {sectionKey}
                            </Tabs.Tab>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <Button
                    onClick={() => {
                      const sectionName = prompt("Enter center of competencies section name:");
                      if (sectionName) {
                        handleAddSection(sectionName);
                      }
                    }}
                    size="sm"
                    variant="light"
                    mt="sm"
                  >
                    + Add Center of Competencies Section
                  </Button>
                </Tabs.List>
              )}
            </Droppable>
          </DragDropContext>

          <Box p="md" className="w-full">
            {sectionOrder.map((sectionKey) => (
              <Tabs.Panel key={sectionKey} value={sectionKey}>
                <Box mb="md" w="100%">
                  <Button
                    color="red"
                    size="xs"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this center of competencies section?"
                        )
                      ) {
                        handleDeleteSection(sectionKey);
                      }
                    }}
                  >
                    Delete Center of Competencies Section
                  </Button>
                </Box>
                <Group justify="space-between" align="center" mb="md">
                  <Title order={2}>{sectionKey}</Title>
                  <Button
                    leftSection={<IconPencil size={16} />}
                    onClick={() => {
                      const newTitle = prompt(
                        "Enter new center of competencies section name:",
                        sectionKey
                      );
                      if (newTitle && newTitle !== sectionKey) {
                        handleSectionUpdate(
                          sectionKey,
                          form.values.sections[sectionKey].content
                        );
                      }
                    }}
                    size="sm"
                  >
                    Edit Title
                  </Button>
                </Group>
                <GenericCMS
                  value={form.values.sections[sectionKey].content}
                  setValue={(newValue) => {
                    handleSectionUpdate(sectionKey, newValue);
                  }}
                />
              </Tabs.Panel>
            ))}
          </Box>
        </Tabs>
      </form>
    </Container>
  );
} 