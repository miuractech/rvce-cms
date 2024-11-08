import React, { useState } from 'react';
import { Event } from '../departmentPage';
import { Box, Button, Card, Group, Stack, TextInput, Title, ActionIcon, Text } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import { RTEComponent } from '../../../components/RTE';
import * as yup from 'yup';

interface EventsProps {
  data: Event[];
}

const eventSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  location: yup.string().required('Location is required'),
  organizers: yup.array().of(yup.string()),
  participantsCount: yup.number()
    .min(0, 'Participants count must be positive')
    .required('Participants count is required'),
  eventType: yup.string().required('Event type is required')
});

const schema = yup.object().shape({
  events: yup.array().of(eventSchema)
});

export const EventsSection: React.FC<EventsProps> = ({ data }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { depId } = useParams();

  const form = useForm({
    initialValues: {
      events: data || [],
    },
    validate: yupResolver(schema)
  });

  const handleSubmit = async (values: any) => {
    if (!depId) return;

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        events: values.events,
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating events:", error);
    }
  };

  const handleDeleteEvent = async (index: number) => {
    if (!depId) return;
    
    const updatedEvents = [...form.values.events];
    updatedEvents.splice(index, 1);
    form.setFieldValue('events', updatedEvents);

    try {
      const deptRef = doc(db, "departments", depId);
      await updateDoc(deptRef, {
        events: updatedEvents,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleAddEvent = () => {
    const newEvent = {
      title: '',
      description: '',
      date: new Date(),
      location: '',
      organizers: [],
      participantsCount: 0,
      eventType: ''
    };
    
    form.setFieldValue('events', [...form.values.events, newEvent]);
    setEditingIndex(form.values.events.length);
  };

  const handleCancel = (index: number) => {
    form.setFieldValue(`events.${index}`, data[index]);
    setEditingIndex(null);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>Events</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddEvent}
          >
            Add Event
          </Button>
        </Group>

        {form.values.events.length === 0 ? (
          <Text c="dimmed" ta="center">No events yet. Click "Add Event" to create one.</Text>
        ) : (
          <Stack gap="md">
            {form.values.events.map((event, index) => (
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
                    onClick={() => handleDeleteEvent(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                {editingIndex === index ? (
                  <Stack gap="md">
                    <TextInput
                      label="Title"
                      {...form.getInputProps(`events.${index}.title`)}
                    />
                    <Box>
                      <Title order={4}>Description</Title>
                      <RTEComponent
                        content={form.values.events[index].description}
                        onChange={(value) =>
                          form.setFieldValue(`events.${index}.description`, value)
                        }
                      />
                      {form.errors[`events.${index}.description`] && (
                        <Text color="red" size="sm">{form.errors[`events.${index}.description`]}</Text>
                      )}
                    </Box> 
                    <TextInput
                      label="Location"
                      {...form.getInputProps(`events.${index}.location`)}
                    />
                    <TextInput
                      label="Event Type"
                      {...form.getInputProps(`events.${index}.eventType`)}
                    />
                    <TextInput
                      label="Participants Count"
                      type="number"
                      {...form.getInputProps(`events.${index}.participantsCount`)}
                    />
                    <Group justify="flex-end">
                      <Button variant="outline" onClick={() => handleCancel(index)}>Cancel</Button>
                      <Button type="submit">Save Event</Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack gap="sm">
                    <Title order={3}>{event.title}</Title>
                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                    <Text>Location: {event.location}</Text>
                    <Text>Event Type: {event.eventType}</Text>
                    <Text>Participants: {event.participantsCount}</Text>
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