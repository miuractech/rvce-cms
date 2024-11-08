import { useForm, yupResolver } from '@mantine/form';
import { Stack, TextInput, Button, Title, Group, ActionIcon, Textarea, Flex, Card } from '@mantine/core';
import { IconPlus, IconTrash, IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import * as yup from "yup" 
import { AnnouncementItem } from '../SectionsPage';
import { useState } from 'react';

interface AnnouncementSectionProps {
  data: AnnouncementItem[];
}

export function AnnouncementSection({ data }: AnnouncementSectionProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const form = useForm({
    initialValues: {
      announcements: data.length > 0 ? data.map(item => ({
        title: item.title || '',
        link: item.link || '',
        date: item.date || ''
      })) : [{
        title: '',
        link: '',
        date: new Date().toISOString().split('T')[0], // Set current date by default
      }]
    },
    validate: yupResolver(yup.object().shape({
      announcements: yup.array().of(
        yup.object().shape({
          title: yup.string().required('Title is required'),
          link: yup.string().url('Link must be a valid URL').required('Link is required'),
          date: yup.string().required('Date is required')
        })
      )
    }))
  });

  const addAnnouncement = () => {
    const newIndex = form.values.announcements.length;
    form.insertListItem('announcements', {
      title: '',
      link: '',
      date: new Date().toISOString().split('T')[0], // Set current date for new announcements
    });
    setEditIndex(newIndex); // Set the new announcement to be in edit mode by default
  };

  const saveAnnouncement = async (index: number) => {
    try {
      const updatedAnnouncements = [...form.values.announcements];
      updatedAnnouncements[index] = form.values.announcements[index];
      await updateDoc(doc(db, "cms", "homepage"), {
        announcements: updatedAnnouncements,
      });
      notifications.show({
        title: "Success",
        message: "Announcement updated successfully",
        color: "green",
      });
      setEditIndex(null);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update announcement",
        color: "red",
      });
    }
  };

  const discardAnnouncement = (index: number) => {
    const announcement = form.values.announcements[index];
    if (!announcement.title && !announcement.link && !announcement.date) {
      form.removeListItem('announcements', index);
    }
    setEditIndex(null);
  };

  return (
    <form onSubmit={form.onSubmit(async (values) => {
      try {
        await updateDoc(doc(db, "cms", "homepage"), {
          announcements: values.announcements,
        });
        notifications.show({
          title: "Success",
          message: "Announcements updated successfully",
          color: "green",
        });
      } catch (error) {
        notifications.show({
          title: "Error", 
          message: "Failed to update announcements",
          color: "red",
        });
      }
    })}>
      <Stack w="100%" gap="lg">
        <Title order={2}>Announcements</Title>
        
        <Flex gap="md" wrap="wrap">
          {form.values.announcements.map((_, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder style={{ flex: '1 1 300px', minWidth: 300, maxWidth: 400 }}>
              <Stack gap="md">
                <Group gap="apart">
                  <Title order={4}>Announcement {index + 1}</Title>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => form.removeListItem('announcements', index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                {editIndex === index ? (
                  <>
                    <TextInput
                      label="Title"
                      placeholder="Enter announcement title"
                      {...form.getInputProps(`announcements.${index}.title`)}
                    />

                    <TextInput
                      label="Link" 
                      placeholder="Enter announcement link"
                      {...form.getInputProps(`announcements.${index}.link`)}
                    />

                    <TextInput
                      label="Date"
                      type="date"
                      value={form.values.announcements[index].date}
                      {...form.getInputProps(`announcements.${index}.date`)}
                    />

                    <Group justify="right" mt="md">
                      <Button
                        color="green"
                        onClick={() => saveAnnouncement(index)}
                        leftSection={<IconCheck size={16} />}
                      >
                        Save
                      </Button>
                      <Button
                        color="red"
                        onClick={() => discardAnnouncement(index)}
                        leftSection={<IconX size={16} />}
                      >
                        Discard
                      </Button>
                    </Group>
                  </>
                ) : (
                  <>
                    <TextInput
                      label="Title"
                      value={form.values.announcements[index].title}
                      readOnly
                    />

                    <TextInput
                      label="Link" 
                      value={form.values.announcements[index].link}
                      readOnly
                    />

                    <TextInput
                      label="Date"
                      type="date"
                      value={form.values.announcements[index].date}
                      readOnly
                    />

                    <Group justify="right" mt="md">
                      <Button
                        color="blue"
                        onClick={() => setEditIndex(index)}
                        leftSection={<IconPencil size={16} />}
                      >
                        Edit
                      </Button>
                    </Group>
                  </>
                )}
              </Stack>
            </Card>
          ))}
        </Flex>
        
        <Group justify="flex-start" gap="md">
          <Button leftSection={<IconPlus size={16} />} onClick={addAnnouncement}>
            Add Announcement
          </Button>
          {/* <Button type="submit">Save Changes</Button> */}
        </Group>
      </Stack>
    </form>
  );
}