import React, { useState } from 'react';
import { ResearchInitiative } from '../departmentPage';
import { Box, Button, Card, Group, Stack, TextInput, Title, ActionIcon, Text } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import { RTEComponent } from '../../../components/RTE';
import { DateInput } from '@mantine/dates';
import * as yup from 'yup';

interface ResearchInitiativesProps {
  data: ResearchInitiative[];
}

const initiativeSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  fundingAgency: yup.string().required('Funding agency is required'),
  amountFunded: yup.number().min(0, 'Amount must be positive'),
  associatedFaculty: yup.array().of(yup.string())
});

const schema = yup.object().shape({
  initiatives: yup.array().of(initiativeSchema)
});

export const ResearchInitiativesSection: React.FC<ResearchInitiativesProps> = ({ data }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { depId } = useParams();

  const form = useForm<{initiatives: ResearchInitiative[]}>({
    initialValues: {
      initiatives: data?.map(initiative => ({
        ...initiative,
        startDate: initiative?.startDate instanceof Timestamp ? 
          initiative.startDate.toDate() : 
          initiative?.startDate ? new Date(initiative.startDate) : new Date(),
        title: initiative?.title || '',
        description: initiative?.description || '',
        fundingAgency: initiative?.fundingAgency || '',
        amountFunded: initiative?.amountFunded || 0,
        associatedFaculty: initiative?.associatedFaculty || []
      })) || [],
    },
    validate: yupResolver(schema)
  });

  const handleSubmit = async (values: {initiatives: ResearchInitiative[]}) => {
    if (!depId) return;

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        researchInitiatives: values.initiatives.map(initiative => ({
          ...initiative,
          startDate: Timestamp.fromDate(new Date(initiative.startDate))
        })),
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating research initiatives:", error);
    }
  };

  const handleDeleteInitiative = async (index: number) => {
    if (!depId) return;
    
    const updatedInitiatives = [...form.values.initiatives];
    updatedInitiatives.splice(index, 1);
    form.setFieldValue('initiatives', updatedInitiatives);

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        researchInitiatives: updatedInitiatives.map(initiative => ({
          ...initiative,
          startDate: Timestamp.fromDate(new Date(initiative.startDate))
        })),
      });
    } catch (error) {
      console.error("Error deleting initiative:", error);
    }
  };

  const handleAddInitiative = () => {
    const newInitiative = {
      title: '',
      description: '',
      startDate: new Date(),
      fundingAgency: '',
      amountFunded: 0,
      associatedFaculty: []
    };
    
    form.setFieldValue('initiatives', [...form.values.initiatives, newInitiative]);
    setEditingIndex(form.values.initiatives.length);
  };

  const handleCancel = (index: number) => {
    if (data && data[index]) {
      form.setFieldValue(`initiatives.${index}`, data[index]);
    }
    setEditingIndex(null);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>Research Initiatives</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddInitiative}
          >
            Add Initiative
          </Button>
        </Group>

        {!form.values.initiatives || form.values.initiatives.length === 0 ? (
          <Text c="dimmed" ta="center">No research initiatives yet. Click "Add Initiative" to create one.</Text>
        ) : (
          <Stack gap="md">
            {form.values.initiatives.map((initiative, index) => (
              <Card key={index} withBorder p="md">
                <Group justify="flex-end" mb="md">
                  <ActionIcon
                    onClick={() => setEditingIndex(index)}
                    color={editingIndex === index ? 'gray': 'blue'}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                  <ActionIcon 
                    color="red"
                    onClick={() => handleDeleteInitiative(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                {editingIndex === index ? (
                  <Stack gap="md">
                    <TextInput
                      label="Title"
                      {...form.getInputProps(`initiatives.${index}.title`)}
                    />
                    <Box>
                      <Title order={4}>Description</Title>
                      <RTEComponent
                        content={form.values.initiatives[index]?.description || ''}
                        onChange={(value) =>
                          form.setFieldValue(`initiatives.${index}.description`, value)
                        }
                      />
                    </Box>
                    <DateInput
                      label="Start Date"
                      value={form.values.initiatives[index]?.startDate || new Date()}
                      onChange={(date) => form.setFieldValue(`initiatives.${index}.startDate`, date)}
                    />
                    <TextInput
                      label="Funding Agency"
                      {...form.getInputProps(`initiatives.${index}.fundingAgency`)}
                    />
                    <TextInput
                      label="Amount Funded"
                      type="number"
                      {...form.getInputProps(`initiatives.${index}.amountFunded`)}
                    />
                    <Box>
                      <Title order={4}>Associated Faculty</Title>
                      {(form.values.initiatives[index]?.associatedFaculty || []).map((faculty, fIndex) => (
                        <Group key={fIndex} mt="xs">
                          <TextInput
                            style={{ flex: 1 }}
                            {...form.getInputProps(`initiatives.${index}.associatedFaculty.${fIndex}`)}
                          />
                          <Button
                            color="red"
                            onClick={() => {
                              const newFaculty = [...(form.values.initiatives[index]?.associatedFaculty || [])];
                              newFaculty.splice(fIndex, 1);
                              form.setFieldValue(`initiatives.${index}.associatedFaculty`, newFaculty);
                            }}
                          >
                            Remove
                          </Button>
                        </Group>
                      ))}
                      <Button
                        mt="sm"
                        onClick={() => {
                          const currentFaculty = form.values.initiatives[index]?.associatedFaculty || [];
                          form.setFieldValue(`initiatives.${index}.associatedFaculty`, [...currentFaculty, '']);
                        }}
                      >
                        Add Faculty Member
                      </Button>
                    </Box>
                    <Group justify="flex-end">
                      <Button variant="outline" onClick={() => handleCancel(index)}>Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack gap="sm">
                    <Title order={3}>{initiative?.title || 'Untitled'}</Title>
                    <div dangerouslySetInnerHTML={{ __html: initiative?.description || '' }} />
                    <Text>Start Date: {initiative?.startDate ? new Date(initiative.startDate).toLocaleDateString() : 'Not set'}</Text>
                    <Text>Funding Agency: {initiative?.fundingAgency || 'Not specified'}</Text>
                    <Text>Amount Funded: {initiative?.amountFunded || 0}</Text>
                    <Box>
                      <Title order={4}>Associated Faculty</Title>
                      {initiative?.associatedFaculty && initiative.associatedFaculty.length > 0 ? (
                        <ul>
                          {initiative.associatedFaculty.map((faculty, fIndex) => (
                            <li key={fIndex}>{faculty}</li>
                          ))}
                        </ul>
                      ) : (
                        <Text c="dimmed">No faculty members associated</Text>
                      )}
                    </Box>
                  </Stack>
                )}
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </form>
  );
};