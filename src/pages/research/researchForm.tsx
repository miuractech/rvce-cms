import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box, NumberInput, MultiSelect } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { notifications } from '@mantine/notifications';

export interface researchPatent {
  id?: string;
  sl: number;
  patentApplication: string;
  status: string;
  patentPublication: number;
  inventors: string;
  inventionTitle: string;
  dateOfFiling: string;
  dateOfGrant: string;
}

export default function ResearchPatentForm() {
  const { patentId } = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<researchPatent>({
    initialValues: {
      sl: 0,
      patentApplication: '',
      status: '',
      patentPublication: 0,
      inventors: '',
      inventionTitle: '',
      dateOfFiling: '',
      dateOfGrant: ''
    }
  });
  const navigate = useNavigate()
  useEffect(() => {
    const fetchPatent = async () => {
      if (!patentId) return;

      try {
        setLoading(true);
        const docRef = doc(db, 'research', patentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          form.setValues(docSnap.data() as researchPatent);
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch patent details',
          color: 'red'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatent();
  }, [patentId]);

  const handleSubmit = async (values: researchPatent) => {
    try {
      setLoading(true);
      if (patentId) {
        // Update existing document
        await setDoc(doc(db, 'research', patentId), values);
      } else {
        // Add new document
        await addDoc(collection(db, 'research'), values);
      }

      notifications.show({
        title: 'Success',
        message: patentId ? 'Patent updated successfully' : 'Patent added successfully',
        color: 'green'
      });
      setTimeout(() => {
        navigate("/research")
      }, 2500);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save patent details',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Box className="mb-4 p-4 rounded-sm border border-gray-300">
        <NumberInput
          label="Serial Number"
          {...form.getInputProps('sl')}
          disabled={loading}
        />

        <TextInput
          label="Patent Application"
          {...form.getInputProps('patentApplication')}
          disabled={loading}
        />

        <TextInput
          label="Status"
          {...form.getInputProps('status')}
          disabled={loading}
        />

        <NumberInput
          label="Patent Publication"
          {...form.getInputProps('patentPublication')}
          disabled={loading}
        />

        <TextInput
          label="Inventors"
          {...form.getInputProps('inventors')}
          disabled={loading}
        />

        <TextInput
          label="Invention Title"
          {...form.getInputProps('inventionTitle')}
          disabled={loading}
        />

        <DateInput
          label="Date of Filing"
          {...form.getInputProps('dateOfFiling')}
          disabled={loading}
        />

        <DateInput
          label="Date of Grant"
          {...form.getInputProps('dateOfGrant')}
          disabled={loading}
        />
      </Box>

      <Group justify="right" mt="md">
        <Button type="submit" loading={loading}>Submit</Button>
      </Group>
    </Box>
  );
}
