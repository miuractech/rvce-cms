import React, { useState } from 'react';
import { ResearchCenter } from '../departmentPage';
import { Box, Button, Group, Stack, TextInput, Title, NumberInput, Text } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IconPencil } from '@tabler/icons-react';
import { RTEComponent } from '../../../components/RTE';
import * as yup from 'yup';

interface ResearchCenterProps {
  data?: ResearchCenter;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  focusAreas: yup.array().of(yup.string().required('Focus area cannot be empty')).min(1, 'At least one focus area is required'),
  description: yup.string().required('Description is required'),
  establishedYear: yup.number()
    .required('Established year is required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  affiliatedFaculty: yup.array().of(yup.string().required('Faculty member name cannot be empty')).min(1, 'At least one faculty member is required')
});

export const VTUResearchSection: React.FC<ResearchCenterProps> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { depId } = useParams();

  const form = useForm<ResearchCenter>({
    initialValues: {
      name: data?.name || '',
      focusAreas: data?.focusAreas || [],
      description: data?.description || '',
      establishedYear: data?.establishedYear || new Date().getFullYear(),
      affiliatedFaculty: data?.affiliatedFaculty || []
    },
    validate: yupResolver(schema)
  });

  const handleSubmit = async (values: ResearchCenter) => {
    if (!depId) return;

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        vtuResearch: values
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating VTU Research Center:", error);
    }
  };

  if (!isEditing) {
    return (
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>VTU Research Center</Title>
          <Button
            leftSection={<IconPencil size={16} />}
            onClick={() => setIsEditing(true)}
          >
            Edit Research Center
          </Button>
        </Group>

        <Box>
          <Title order={4}>Name</Title>
          <p>{data?.name}</p>
        </Box>

        <Box>
          <Title order={4}>Description</Title>
          <div dangerouslySetInnerHTML={{ __html: data?.description || '' }} />
        </Box>

        <Box>
          <Title order={4}>Focus Areas</Title>
          <ul>
            {data?.focusAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </Box>

        <Box>
          <Title order={4}>Established Year</Title>
          <p>{data?.establishedYear}</p>
        </Box>

        <Box>
          <Title order={4}>Affiliated Faculty</Title>
          <ul>
            {data?.affiliatedFaculty.map((faculty, index) => (
              <li key={index}>{faculty}</li>
            ))}
          </ul>
        </Box>
      </Stack>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>Edit Research Center</Title>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Group>

        <TextInput
          label="Name"
          {...form.getInputProps('name')}
        />

        <Box>
          <Title order={4}>Description</Title>
          <RTEComponent
            content={form.values.description}
            onChange={(value) => form.setFieldValue('description', value)}
          />
          {form.errors.description && (
            <Text color="red" size="sm">{form.errors.description}</Text>
          )}
        </Box>

        <Box>
          <Title order={4}>Focus Areas</Title>
          {form.values.focusAreas.map((area, index) => (
            <Group key={index} mt="xs">
              <TextInput
                style={{ flex: 1 }}
                {...form.getInputProps(`focusAreas.${index}`)}
              />
              <Button
                color="red"
                onClick={() => {
                  const newAreas = [...form.values.focusAreas];
                  newAreas.splice(index, 1);
                  form.setFieldValue('focusAreas', newAreas);
                }}
              >
                Remove
              </Button>
            </Group>
          ))}
          <Button
            mt="sm"
            onClick={() => form.insertListItem('focusAreas', '')}
          >
            Add Focus Area
          </Button>
        </Box>

        <NumberInput
          label="Established Year"
          {...form.getInputProps('establishedYear')}
        />

        <Box>
          <Title order={4}>Affiliated Faculty</Title>
          {form.values.affiliatedFaculty.map((faculty, index) => (
            <Group key={index} mt="xs">
              <TextInput
                style={{ flex: 1 }}
                {...form.getInputProps(`affiliatedFaculty.${index}`)}
              />
              <Button
                color="red"
                onClick={() => {
                  const newFaculty = [...form.values.affiliatedFaculty];
                  newFaculty.splice(index, 1);
                  form.setFieldValue('affiliatedFaculty', newFaculty);
                }}
              >
                Remove
              </Button>
            </Group>
          ))}
          <Button
            mt="sm"
            onClick={() => form.insertListItem('affiliatedFaculty', '')}
          >
            Add Faculty Member
          </Button>
        </Box>

        <Group justify="flex-end">
          <Button type="submit">Save Changes</Button>
        </Group>
      </Stack>
    </form>
  );
};