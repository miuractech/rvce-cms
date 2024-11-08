import React, { useState } from 'react';
import { Placement } from '../departmentPage';
import { Box, Button, Card, Group, Stack, TextInput, Title, ActionIcon, Text, LoadingOverlay } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';

interface PlacementsProps {
  data: Placement[];
}

const placementSchema = yup.object().shape({
  companyName: yup.string().trim().required('Company name is required'),
  jobRole: yup.string().trim().required('Job role is required'),
  package: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, 'Package must be positive')
    .required('Package is required'),
  placementYear: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear() + 1, 'Year cannot be in future')
    .required('Year is required'),
  studentsPlaced: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, 'Number of students must be positive')
    .required('Number of students placed is required'),
  recruitmentProcess: yup.string().trim().required('Recruitment process is required')
});

const schema = yup.object().shape({
  placements: yup.array().of(placementSchema).required('At least one placement is required')
});

export const PlacementsSection: React.FC<PlacementsProps> = ({ data }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { depId } = useParams();

  const form = useForm({
    initialValues: {
      placements: data || [],
    },
    validate: yupResolver(schema)
  });

  const handleSubmit = async (values: { placements: Placement[] }) => {
    if (!depId) {
      notifications.show({
        title: 'Error',
        message: 'Department ID not found',
        color: 'red'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        placements: values.placements,
      });
      setEditingIndex(null);
      notifications.show({
        title: 'Success',
        message: 'Placement data updated successfully',
        color: 'green'
      });
    } catch (error) {
      console.error("Error updating placements:", error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update placement data',
        color: 'red'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlacement = async (index: number) => {
    if (!depId || !window.confirm('Are you sure you want to delete this placement?')) return;
    
    setIsSubmitting(true);
    try {
      const updatedPlacements = [...form.values.placements];
      updatedPlacements.splice(index, 1);
      form.setFieldValue('placements', updatedPlacements);

      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        placements: updatedPlacements,
      });
      notifications.show({
        title: 'Success',
        message: 'Placement deleted successfully',
        color: 'green'
      });
    } catch (error) {
      console.error("Error deleting placement:", error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete placement',
        color: 'red'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPlacement = () => {
    const newPlacement: Placement = {
      companyName: '',
      jobRole: '',
      package: '0',
      placementYear: new Date().getFullYear(),
      studentsPlaced: 0,
      recruitmentProcess: ''
    };
    
    form.setFieldValue('placements', [...form.values.placements, newPlacement]);
    setEditingIndex(form.values.placements.length);
  };

  const handleCancel = (index: number) => {
    if (data[index]) {
      form.setFieldValue(`placements.${index}`, data[index]);
    } else {
      const updatedPlacements = [...form.values.placements];
      updatedPlacements.splice(index, 1);
      form.setFieldValue('placements', updatedPlacements);
    }
    setEditingIndex(null);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isSubmitting} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title order={2}>Placements</Title>
            <Button leftSection={<IconPlus size={14} />} onClick={handleAddPlacement}>
              Add Placement
            </Button>
          </Group>

          {form.values.placements.map((placement, index) => (
            <Card key={index} withBorder shadow="sm">
              {editingIndex === index ? (
                <Stack gap="md">
                  <TextInput
                    label="Company Name"
                    {...form.getInputProps(`placements.${index}.companyName`)}
                  />
                  <TextInput
                    label="Job Role"
                    {...form.getInputProps(`placements.${index}.jobRole`)}
                  />
                  <TextInput
                    label="Package (LPA)"
                    type="number"
                    {...form.getInputProps(`placements.${index}.package`)}
                  />
                  <TextInput
                    label="Placement Year"
                    type="number"
                    {...form.getInputProps(`placements.${index}.placementYear`)}
                  />
                  <TextInput
                    label="Students Placed"
                    type="number"
                    {...form.getInputProps(`placements.${index}.studentsPlaced`)}
                  />
                  <TextInput
                    label="Recruitment Process"
                    {...form.getInputProps(`placements.${index}.recruitmentProcess`)}
                  />
                  <Group justify="flex-end">
                    <Button variant="outline" onClick={() => handleCancel(index)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </Group>
                </Stack>
              ) : (
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Title order={3}>{placement.companyName}</Title>
                    <Group>
                      <ActionIcon 
                        variant="subtle" 
                        onClick={() => setEditingIndex(index)}
                        aria-label="Edit"
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="red" 
                        onClick={() => handleDeletePlacement(index)}
                        aria-label="Delete"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text><strong>Job Role:</strong> {placement.jobRole}</Text>
                  <Text><strong>Package:</strong> {placement.package} LPA</Text>
                  <Text><strong>Year:</strong> {placement.placementYear}</Text>
                  <Text><strong>Students Placed:</strong> {placement.studentsPlaced}</Text>
                  <Text><strong>Recruitment Process:</strong> {placement.recruitmentProcess}</Text>
                </Stack>
              )}
            </Card>
          ))}
        </Stack>
      </form>
    </Box>
  );
};