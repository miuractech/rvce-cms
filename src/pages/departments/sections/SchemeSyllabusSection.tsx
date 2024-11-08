import React, { useState } from 'react';
import { SchemeAndSyllabus } from '../departmentPage';
import { Box, Button, Card, Group, Stack, TextInput, Title, ActionIcon, Text, LoadingOverlay } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { MiuracImage } from '../../../miurac-images/miurac-image';
import * as yup from 'yup';

interface SchemeSyllabusProps {
  data: SchemeAndSyllabus[];
}

const syllabusSchema = yup.object().shape({
  programName: yup.string().trim().required('Program name is required'),
  year: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear() + 1, 'Year cannot be in future')
    .required('Year is required'),
  semester: yup.number()
    .min(1, 'Invalid semester')
    .required('Semester is required'),
  syllabusUrl: yup.string().required('Syllabus URL is required'),
  creditDistribution: yup.object().shape({
    theory: yup.number().required('Theory credits required'),
    practical: yup.number().required('Practical credits required'),
    project: yup.number()
  })
});

const schema = yup.object().shape({
  syllabuses: yup.array().of(syllabusSchema)
});

export const SchemeSyllabusSection: React.FC<SchemeSyllabusProps> = ({ data }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { depId } = useParams();

  const form = useForm({
    initialValues: {
      syllabuses: data || [],
    },
    validate: yupResolver(schema)
  });

  const handleSubmit = async (values: { syllabuses: SchemeAndSyllabus[] }) => {
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
        syllabus: values.syllabuses,
      });
      setEditingIndex(null);
      notifications.show({
        title: 'Success',
        message: 'Syllabus data updated successfully',
        color: 'green'
      });
    } catch (error) {
      console.error("Error updating syllabus:", error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update syllabus data',
        color: 'red'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSyllabus = async (index: number) => {
    if (!depId || !window.confirm('Are you sure you want to delete this syllabus?')) return;
    
    setIsSubmitting(true);
    try {
      const updatedSyllabuses = [...form.values.syllabuses];
      updatedSyllabuses.splice(index, 1);
      form.setFieldValue('syllabuses', updatedSyllabuses);

      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        syllabus: updatedSyllabuses,
      });
      notifications.show({
        title: 'Success',
        message: 'Syllabus deleted successfully',
        color: 'green'
      });
    } catch (error) {
      console.error("Error deleting syllabus:", error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete syllabus',
        color: 'red'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSyllabus = () => {
    const newSyllabus: SchemeAndSyllabus = {
      programName: '',
      year: new Date().getFullYear(),
      semester: 1,
      syllabusUrl: '',
      creditDistribution: {
        theory: 0,
        practical: 0,
        project: 0
      }
    };
    
    form.setFieldValue('syllabuses', [...form.values.syllabuses, newSyllabus]);
    setEditingIndex(form.values.syllabuses.length);
  };

  const handleCancel = (index: number) => {
    if (data[index]) {
      form.setFieldValue(`syllabuses.${index}`, data[index]);
    } else {
      const updatedSyllabuses = [...form.values.syllabuses];
      updatedSyllabuses.splice(index, 1);
      form.setFieldValue('syllabuses', updatedSyllabuses);
    }
    setEditingIndex(null);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isSubmitting} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title order={2}>Scheme and Syllabus</Title>
            <Button leftSection={<IconPlus size={14} />} onClick={handleAddSyllabus}>
              Add Syllabus
            </Button>
          </Group>

          {form.values.syllabuses.map((syllabus, index) => (
            <Card key={index} withBorder shadow="sm">
              {editingIndex === index ? (
                <Stack gap="md">
                  <TextInput
                    label="Program Name"
                    {...form.getInputProps(`syllabuses.${index}.programName`)}
                  />
                  <TextInput
                    label="Year"
                    type="number"
                    {...form.getInputProps(`syllabuses.${index}.year`)}
                  />
                  <TextInput
                    label="Semester"
                    type="number"
                    {...form.getInputProps(`syllabuses.${index}.semester`)}
                  />
                  <MiuracImage
                    updateFirestore={true}
                    editConfig={null}
                    setUrlFunc={(url) => form.setFieldValue(`syllabuses.${index}.syllabusUrl`, url)}
                    image={form.values.syllabuses[index].syllabusUrl}
                  />
                  <TextInput
                    label="Theory Credits"
                    type="number"
                    {...form.getInputProps(`syllabuses.${index}.creditDistribution.theory`)}
                  />
                  <TextInput
                    label="Practical Credits"
                    type="number"
                    {...form.getInputProps(`syllabuses.${index}.creditDistribution.practical`)}
                  />
                  <TextInput
                    label="Project Credits"
                    type="number"
                    {...form.getInputProps(`syllabuses.${index}.creditDistribution.project`)}
                  />
                  <Group justify="flex-end">
                    <Button variant="outline" onClick={() => handleCancel(index)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </Group>
                </Stack>
              ) : (
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Title order={3}>{syllabus.programName}</Title>
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
                        onClick={() => handleDeleteSyllabus(index)}
                        aria-label="Delete"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text><strong>Year:</strong> {syllabus.year}</Text>
                  <Text><strong>Semester:</strong> {syllabus.semester}</Text>
                  <Text><strong>Credits:</strong></Text>
                  <Text>Theory: {syllabus.creditDistribution.theory}</Text>
                  <Text>Practical: {syllabus.creditDistribution.practical}</Text>
                  {syllabus.creditDistribution.project && (
                    <Text>Project: {syllabus.creditDistribution.project}</Text>
                  )}
                  {syllabus.syllabusUrl && (
                    <img src={syllabus.syllabusUrl} alt="Syllabus" style={{ maxWidth: '100%' }} />
                  )}
                </Stack>
              )}
            </Card>
          ))}
        </Stack>
      </form>
    </Box>
  );
};