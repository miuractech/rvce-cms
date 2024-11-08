import { useForm, yupResolver } from "@mantine/form";
import {
  Stack,
  TextInput,
  Button,
  Title,
  Group,
  ActionIcon,
  Box,
  Card,
  Flex,
  Text,
} from "@mantine/core";
import { MiuracImage } from "../../../miurac-images/miurac-image";
import {
  IconPencil,
  IconPlus,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { notifications } from "@mantine/notifications";
import { RTEComponent } from "../../../components/RTE";
import * as yup from "yup";
import { useState } from "react";

interface CarouselItem {
  image: string;
  title?: string;
  subtitle?: string;
}

interface CarouselSectionProps {
  data: CarouselItem[];
}

export function CarouselSection({ data }: CarouselSectionProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const form = useForm({
    initialValues: {
      slides:
        data.length > 0
          ? data.map((item) => ({
              title: item.title || "",
              subtitle: item.subtitle || "",
              image: item.image || "",
            }))
          : [
              {
                title: "",
                subtitle: "",
                image: "",
              },
            ],
    },
    validate: yupResolver(
      yup.object().shape({
        slides: yup.array().of(
          yup.object().shape({
            title: yup.string().required("Title is required"),
            subtitle: yup.string().required("Subtitle is required"),
            image: yup.string().required("Image is required"),
          })
        ),
      })
    ),
  });

  const addSlide = () => {
    const newIndex = form.values.slides.length;
    form.insertListItem("slides", {
      title: "",
      subtitle: "",
      image: "",
    });
    setEditIndex(newIndex); // Set the new slide to be in edit mode by default
  };

  const saveSlide = async (index: number) => {
    try {
      const updatedSlides = [...form.values.slides];
      await updateDoc(doc(db, "cms", "homepage"), {
        carousel: updatedSlides,
      });
      notifications.show({
        title: "Success",
        message: "Slide updated successfully",
        color: "green",
      });
      setEditIndex(null);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update slide",
        color: "red",
      });
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        try {
          await updateDoc(doc(db, "cms", "homepage"), {
            carousel: values.slides,
          });
          notifications.show({
            title: "Success",
            message: "Carousel settings updated successfully",
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: "Error",
            message: "Failed to update carousel settings",
            color: "red",
          });
        }
      })}
    >
      <Flex w="100%">
        <Stack w="100%" gap="lg">
          <Title order={2}>Carousel Settings</Title>

          {form.values.slides.map((slide, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                {slide.image ? (
                  <Box
                    pos="relative"
                    onClick={() =>
                      form.setFieldValue(`slides.${index}.image`, "")
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title || "Carousel slide"}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <ActionIcon
                      pos={"absolute"}
                      top={5}
                      right={5}
                      color="gray"
                      onClick={() =>
                        form.setFieldValue(`slides.${index}.image`, "")
                      }
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                  </Box>
                ) : (
                  <MiuracImage
                    editConfig={null}
                    setUrlFunc={(url) =>
                      typeof url === "string"
                        ? form.setFieldValue(`slides.${index}.image`, url)
                        : null
                    }
                    updateFirestore={true}
                    allowMultiple={false}
                    buttonComponent={
                      <Box
                        style={{
                          width: "100%",
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f8f9fa",
                          border: "1px dashed #ced4da",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <Stack align="center" gap={4}>
                          <IconPlus size={24} color="#868e96" />
                          <Text size="sm" c="dimmed">
                            Add Image
                          </Text>
                        </Stack>
                      </Box>
                    }
                  />
                )}
              </Card.Section>

              <Stack mt="md" gap="sm">
                <TextInput
                  label="Title"
                  {...form.getInputProps(`slides.${index}.title`)}
                  disabled={editIndex !== index}
                />
                {editIndex === index ? (
                  <RTEComponent
                    label="Subtitle"
                    content={form.values.slides[index].subtitle}
                    onChange={(e) =>
                      form.setFieldValue(`slides.${index}.subtitle`, e)
                    }
                  />
                ) : (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: form.values.slides[index].subtitle,
                    }}
                  />
                )}
              </Stack>

              <Group justify="right" mt="md">
                {editIndex === index ? (
                  <>
                    <Button
                      color="green"
                      onClick={() => saveSlide(index)}
                      leftSection={<IconCheck size={16} />}
                    >
                      Save
                    </Button>
                    <Button
                      color="red"
                      onClick={() => setEditIndex(null)}
                      leftSection={<IconX size={16} />}
                    >
                      Discard
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="blue"
                      onClick={() => setEditIndex(index)}
                      leftSection={<IconPencil size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      onClick={() => form.removeListItem("slides", index)}
                      leftSection={<IconTrash size={16} />}
                    >
                      DELETE
                    </Button>
                  </>
                )}
              </Group>
            </Card>
          ))}

          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={addSlide}
          >
            Add Slide
          </Button>
          {/* <Button type="submit">Save Changes</Button> */}
        </Stack>
      </Flex>
    </form>
  );
}
