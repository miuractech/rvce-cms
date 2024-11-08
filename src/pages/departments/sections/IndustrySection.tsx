import React, { useState } from 'react';
import { IndustryPartnership } from '../departmentPage';
import { Box, Button, Card, Group, Stack, TextInput, Title, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import { RTEComponent } from '../../../components/RTE';
import { MiuracImage } from '../../../miurac-images/miurac-image';

interface IndustryProps {
  data: IndustryPartnership[];
}

export const IndustrySection: React.FC<IndustryProps> = ({ data }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { depId } = useParams();

  const form = useForm({
    initialValues: {
      partnerships: data || [],
    },
  });

  const handleSubmit = async (values: any) => {
    if (!depId) return;

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        industry: values.partnerships,
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating industry partnerships:", error);
    }
  };

  const handleSavePartnership = async (index: number) => {
    if (!depId) return;

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        industry: form.values.partnerships,
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating partnership:", error);
    }
  };

  const handleDeletePartnership = async (index: number) => {
    if (!depId) return;
    
    const updatedPartnerships = [...form.values.partnerships];
    updatedPartnerships.splice(index, 1);
    form.setFieldValue('partnerships', updatedPartnerships);

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        industry: updatedPartnerships,
      });
    } catch (error) {
      console.error("Error deleting partnership:", error);
    }
  };

  const handleAddPartnership = () => {
    const newPartnership = {
      partnerName: '',
      partnershipType: '',
      description: '',
      companyLogo: '',
      startDate: new Date(),
      endDate: new Date()
    };
    
    form.setFieldValue('partnerships', [...form.values.partnerships, newPartnership]);
    setEditingIndex(form.values.partnerships.length);
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>Industry Partnerships</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleAddPartnership}
        >
          Add Partnership
        </Button>
      </Group>

      <Stack gap="md">
        {form.values.partnerships.map((partnership, index) => (
          <Card key={index} withBorder p="md" pos="relative">
            <Group justify="flex-end" mb="md">
              <ActionIcon
                onClick={() => setEditingIndex(index)}
                color={editingIndex === index ? 'gray': 'blue'}
              >
                <IconPencil size={16} />
              </ActionIcon>
              <ActionIcon 
                color="red"
                onClick={() => handleDeletePartnership(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>

            {editingIndex === index ? (
              <Stack gap="md">
                <TextInput
                  label="Partner Name"
                  {...form.getInputProps(`partnerships.${index}.partnerName`)}
                />
                <TextInput
                  label="Partnership Type"
                  {...form.getInputProps(`partnerships.${index}.partnershipType`)}
                />
                <Box>
                  <Title order={4}>Description</Title>
                  <RTEComponent
                    content={form.values.partnerships[index].description}
                    onChange={(value) =>
                      form.setFieldValue(`partnerships.${index}.description`, value)
                    }
                  />
                </Box>
                <Box>
                  <Title order={4}>Company Logo</Title>
                  {partnership.companyLogo ? (
                    <Box pos="relative" display="inline-block">
                      <img 
                        src={partnership.companyLogo} 
                        alt={partnership.partnerName}
                        style={{ maxWidth: '200px' }}
                      />
                      <ActionIcon
                        pos="absolute"
                        top="5px"
                        right="5px"
                        color="red"
                        onClick={() => form.setFieldValue(`partnerships.${index}.companyLogo`, '')}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Box>
                  ) : (
                    <MiuracImage
                      editConfig={null}
                      setUrlFunc={(url) =>
                        typeof url === "string"
                          ? form.setFieldValue(`partnerships.${index}.companyLogo`, url)
                          : null
                      }
                      updateFirestore={true}
                      allowMultiple={false}
                      buttonComponent={
                        <Button variant="outline">Upload Logo</Button>
                      }
                    />
                  )}
                </Box>
                <Group justify="flex-end">
                  <Button onClick={() => setEditingIndex(null)} variant="outline">Cancel</Button>
                  <Button onClick={() => handleSavePartnership(index)}>Save Changes</Button>
                </Group>
              </Stack>
            ) : (
              <>
                <Group>
                  {partnership.companyLogo && (
                    <img 
                      src={partnership.companyLogo} 
                      alt={partnership.partnerName}
                      style={{ maxWidth: '100px' }}
                    />
                  )}
                  <Box>
                    <Title order={4}>{partnership.partnerName}</Title>
                    <Title order={5} c="dimmed">{partnership.partnershipType}</Title>
                  </Box>
                </Group>
                <div dangerouslySetInnerHTML={{ __html: partnership.description }} />
              </>
            )}
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};