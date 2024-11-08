  import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { CoCurricularActivity } from '../departmentPage';
import { TextInput, Button, Stack, ActionIcon, Box, Card, Title, Group } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import { RTEComponent } from '../../../components/RTE';

interface CoCurricularProps {
  data: CoCurricularActivity[];
}

export const CoCurricularSection: React.FC<CoCurricularProps> = ({ data }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { depId } = useParams();

  const form = useForm({
    initialValues: {
      activities: data || [],
    },
  });

  const handleSubmit = async (values: any) => {
    if (!depId) return;

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        coCurricularActivities: values.activities,
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating co-curricular activities:", error);
    }
  };

  const handleDeleteActivity = (index: number) => {
    const updatedActivities = [...form.values.activities];
    updatedActivities.splice(index, 1);
    form.setFieldValue('activities', updatedActivities);
  };

  const handleAddActivity = () => {
    form.insertListItem('activities', {
      title: '',
      description: ''
    });
    setEditingIndex(form.values.activities.length);
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>Co-Curricular Activities</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleAddActivity}
        >
          Add Activity
        </Button>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {form.values.activities.map((activity, index) => (
            <Card key={index} withBorder p="md" pos="relative">
              <Group justify="flex-end" mb="md">
                <ActionIcon
                  onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  color={editingIndex === index ? 'blue' : 'gray'}
                >
                  <IconPencil size={16} />
                </ActionIcon>
                <ActionIcon 
                  color="red"
                  onClick={() => handleDeleteActivity(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              {editingIndex === index ? (
                <Stack gap="md">
                  <TextInput
                    label="Title"
                    {...form.getInputProps(`activities.${index}.title`)}
                  />
                  <Box>
                    <Title order={4}>Description</Title>
                    <RTEComponent
                      content={form.values.activities[index].description}
                      onChange={(value) =>
                        form.setFieldValue(`activities.${index}.description`, value)
                      }
                    />
                  </Box>
                  <Group justify="flex-end">
                    <Button type="submit">Save Changes</Button>
                  </Group>
                </Stack>
              ) : (
                <>
                  <Title order={4}>{activity.title}</Title>
                  <div dangerouslySetInnerHTML={{ __html: activity.description }} />
                </>
              )}
            </Card>
          ))}
        </Stack>
      </form>
    </Stack>
  );
};