import React, { useState } from "react";
import {
  Box,
  Title,
Button,
Stack,
TextInput,
Group,
ActionIcon,
Select,
} from "@mantine/core";
import { Achievement } from "../departmentPage";
import { useForm, yupResolver } from "@mantine/form";
import { RTEComponent } from "../../../components/RTE";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import * as yup from "yup";
import { DatePicker } from "@mantine/dates";

interface AchievementsProps {
  data: Achievement[];
}

const achievementSchema = yup.object().shape({
  achievements: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Title is required"),
      description: yup.string().required("Description is required"),
      // date: yup.date().required("Date is required"),
      awardType: yup.string().required("Award Type is required"),
      recipientName: yup.string().required("Recipient Name is required"),
    })
  ),
});

export const AchievementsSection: React.FC<AchievementsProps> = ({ data }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { depId } = useParams();

  const form = useForm<{ achievements: Achievement[] }>({
    initialValues: {
      achievements: data.length > 0 ? data : [],
    },
    validate: yupResolver(achievementSchema),
  });

  const handleSave = async (values: typeof form.values) => {
    if (depId) {
      try {
        const deptRef = doc(db, "departments", depId);
        const updatedAchievements = [...values.achievements];
        
        await updateDoc(deptRef, {
          achievements: updatedAchievements,
        });
        setEditingIndex(null);
      } catch (error) {
        console.error("Error updating achievements:", error);
      }
    }
  };
  console.log(form.errors);
  
  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>Achievements</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            form.insertListItem("achievements", {
              title: "",
              description: "",
              date: new Date(),
              awardType: "",
              recipientName: "",
            });
            setEditingIndex(form.values.achievements.length);
          }}
        >
          Add Achievement
        </Button>
      </Group>

      {form.values.achievements.map((achievement, index) => (
        <Box key={index} pos="relative" py={16}>
          {editingIndex === index ? (
            <form onSubmit={form.onSubmit((values) => handleSave(values))}>
              <Stack gap="md">
                <Box>
                  <Title order={4}>Title</Title>
                  <TextInput
                    {...form.getInputProps(`achievements.${index}.title`)}
                  />
                </Box>

                <Box>
                  <Title order={4}>Description</Title>
                  <RTEComponent
                    content={form.values.achievements[index].description}
                    onChange={(value) =>
                      form.setFieldValue(
                        `achievements.${index}.description`,
                        value
                      )
                    }
                  />
                </Box>

                <Box>
                  <Title order={4}>Award Type</Title>
                  <TextInput
                    {...form.getInputProps(`achievements.${index}.awardType`)}
                  />
                </Box>

                <Box>
                  <Title order={4}>Recipient Name</Title>
                  <TextInput
                    {...form.getInputProps(`achievements.${index}.recipientName`)}
                  />
                </Box>

                <Box>
                  <Title order={4}>Date</Title>
                  <DatePicker
                    {...form.getInputProps(`achievements.${index}.date`)}
                  />
                </Box>

                <ActionIcon
                  pos="absolute"
                  top={5}
                  right={5}
                  color="red"
                  onClick={() => {
                    const achievements = [...form.values.achievements];
                    achievements.splice(index, 1);
                    form.setFieldValue("achievements", achievements);
                    setEditingIndex(null);
                  }}
                >
                  <IconTrash size={16} />
                </ActionIcon>

                <Group>
                  <Button type="submit">Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditingIndex(null)}>
                    Cancel
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : (
            <div className="p-4 border border-gray-200 rounded-lg shadow-md bg-white">
              <h4 className="text-lg font-semibold mb-2">{achievement.title}</h4>
              <div
                dangerouslySetInnerHTML={{ __html: achievement.description }}
                className="mb-4"
              />
              <p className="text-sm text-gray-500 mb-4">
                {new Date(achievement.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {achievement.awardType}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {achievement.recipientName}
              </p>
              <button
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                onClick={() => setEditingIndex(index)}
              >
                <IconPencil size={16} className="inline-block mr-2" />
                Edit
              </button>
            </div>
          )}
        </Box>
      ))}
    </Stack>
  );
};
