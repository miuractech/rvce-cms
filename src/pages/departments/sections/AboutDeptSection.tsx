import React from "react";
import { Box, Title, Button, Stack, ActionIcon } from "@mantine/core";
import { RTEComponent } from "../../../components/RTE";
import { AboutDept } from "../departmentPage";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { MiuracImage } from "../../../miurac-images/miurac-image";
import { IconX } from "@tabler/icons-react";
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { notifications } from "@mantine/notifications";

interface AboutDeptProps {
  data?: AboutDept;
  isEditing?: boolean;
}

const validationSchema = yup.object().shape({
  intro: yup.object().shape({
    description: yup.string().required("Description is required"),
    title: yup.string().required("Title is required"),
    img: yup.string().required("Image is required"),
  }),
  vision: yup.string().required("Vision is required"),
  mission: yup.string().required("Mission is required"),
  objectives: yup.string().required("Objectives is required"),
  highlights: yup.string().required("Highlights is required"),
});

export const AboutDeptSection: React.FC<AboutDeptProps> = ({
  data,
}) => {
  const { depId } = useParams();

  const form = useForm({
    initialValues: data || {
      intro: {
        description: "",
        title: "",
        img: "",
      },
      vision: "",
      mission: "",
      objectives: "",
      highlights: "",
    },
    validate: yupResolver(validationSchema)
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (!depId) {
        notifications.show({
          title: "Error",
          message: "Department ID is missing",
          color: "red",
        });
        return;
      }

      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        about: values
      });

      notifications.show({
        title: "Success",
        message: "Department information updated successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error updating department:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update department information",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}> 
    About
      <Stack gap="xl">
        <Box>
          <Title order={3}>Title</Title>
          <RTEComponent
            content={form.values.intro.title}
            onChange={(value) => form.setFieldValue("intro.title", value)}
          />
          {form.errors["intro.title"] && (
            <div style={{ color: "red" }}>{form.errors["intro.title"]}</div>
          )}
        </Box>

        <Box>
          <Title order={3}>Image</Title>
          {!form.values.intro.img ? (
            <MiuracImage
              editConfig={null}
              updateFirestore
              allowMultiple={false}
              setUrlFunc={(value: string | string[]) => {
                if (typeof value === "string") {
                  form.setFieldValue("intro.img", value);
                }
              }}
            />
          ) : (
            <Box pos="relative" maw={400}>
              <img src={form.values.intro.img} alt="Department" style={{ width: '100%', height: 'auto' }} />
              <ActionIcon 
                pos="absolute" 
                top={5} 
                right={5}
                variant="filled"
                onClick={() => form.setFieldValue("intro.img", "")}
              >
                <IconX size={16} />
              </ActionIcon>
            </Box>
          )}
          {form.errors["intro.img"] && (
            <div style={{ color: "red" }}>{form.errors["intro.img"]}</div>
          )}
        </Box>

        <Box>
          <Title order={3}>Description</Title>
          <RTEComponent
            content={form.values.intro.description}
            onChange={(value) => form.setFieldValue("intro.description", value)}
          />
          {form.errors["intro.description"] && (
            <div style={{ color: "red" }}>{form.errors["intro.description"]}</div>
          )}
        </Box>

        <Box>
          <Title order={3}>Vision</Title>
          <RTEComponent
            content={form.values.vision}
            onChange={(value) => form.setFieldValue("vision", value)}
          />
          {form.errors.vision && (
            <div style={{ color: "red" }}>{form.errors.vision}</div>
          )}
        </Box>

        <Box>
          <Title order={3}>Mission</Title>
          <RTEComponent
            content={form.values.mission}
            onChange={(value) => form.setFieldValue("mission", value)}
          />
          {form.errors.mission && (
            <div style={{ color: "red" }}>{form.errors.mission}</div>
          )}
        </Box>

        <Box>
          <Title order={3}>Objectives</Title>
          <RTEComponent
            content={form.values.objectives}
            onChange={(value) => form.setFieldValue("objectives", value)}
          />
          {form.errors.objectives && (
            <div style={{ color: "red" }}>{form.errors.objectives}</div>
          )}
        </Box>

        <Box>
          <Title order={3}>Highlights</Title>
          <RTEComponent
            content={form.values.highlights}
            onChange={(value) => form.setFieldValue("highlights", value)}
          />
          {form.errors.highlights && (
            <div style={{ color: "red" }}>{form.errors.highlights}</div>
          )}
        </Box>

         <Button type="submit">Save Changes</Button>
      </Stack>
    </form>
  );
};
