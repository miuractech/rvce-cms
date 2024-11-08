import React, { useState } from 'react';
import { Infrastructure } from '../departmentPage';
import { Box, Button, Group, Stack, Title, Text, Card } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import * as yup from 'yup';
import { RTEComponent } from '../../../components/RTE';

interface InfrastructureProps {
  data?: Infrastructure;
}

const schema = yup.object().shape({
  facilities: yup
    .array()
    .of(yup.string().required('Facility cannot be empty'))
    .min(1, 'At least one facility is required')
});

export const InfrastructureSection: React.FC<InfrastructureProps> = ({ data }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { depId } = useParams();
console.log(data);

  const form = useForm<Infrastructure>({
    initialValues: {
      facilities: data?.facilities || []
    }, 
    validate: yupResolver(schema)
  });

  const handleSaveFacility = async (index: number) => {
    if (!depId) return;

    try {
      const deptRef = doc(db, "departments", depId);
      const newFacilities = [...form.values.facilities];
      await updateDoc(deptRef, {
        [`infrastructure.facilities`]: newFacilities
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating facility:", error);
    }
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>Infrastructure</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            form.insertListItem('facilities', '');
            setEditingIndex(form.values.facilities.length);
          }}
        >
          Add Facility
        </Button>
      </Group>

      <Box>
        <Title order={4}>Facilities</Title>
        {form.values.facilities.map((facility, index) => (
          <Group key={index} mt="xs">
            {editingIndex === index ? (
              <>
                <RTEComponent
                  content={facility}
                  onChange={(value) => {
                    const newFacilities = [...form.values.facilities];
                    newFacilities[index] = value;
                    form.setFieldValue('facilities', newFacilities);
                  }}
                />
                <Button
                  color="red"
                  onClick={() => {
                    const newFacilities = [...form.values.facilities];
                    newFacilities.splice(index, 1);
                    form.setFieldValue('facilities', newFacilities);
                    setEditingIndex(null);
                  }}
                >
                  Remove
                </Button>
                <Button
                  onClick={() => handleSaveFacility(index)}
                >
                  Save
                </Button>
              </>
            ) : (
              <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
                <Card.Section>
                  <div className='p-4 ' dangerouslySetInnerHTML={{ __html: facility }}></div>
                </Card.Section>
                <Group justify="flex-end" mt="md">
                  <Button
                    leftSection={<IconPencil size={16} />}
                    onClick={() => setEditingIndex(index)}
                  >
                    Edit
                  </Button>
                </Group>
              </Card>
            )}
          </Group>
        ))}
     
      </Box>
    </Stack>
  );
};