import { useState } from 'react';
import { useForm } from '@mantine/form';
import { Stack, TextInput, Button, Title, Group, ActionIcon, Card } from '@mantine/core';
import { IconPlus, IconTrash, IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import { UpdateItem } from '../SectionsPage';
import { RTEComponent } from '../../../components/RTE';
import { notifications } from '@mantine/notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

interface UpdatesSectionProps {
  data?: UpdateItem;
}

export function UpdatesSection({ data }: UpdatesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    initialValues: {
      title: data?.title || '',
      updates: Array.isArray(data?.updates) && data.updates.length > 0 
        ? data.updates 
        : []
    }
  });

  const addUpdateDetail = () => {
    form.insertListItem('updates', ''); // Add an empty string for a new update detail
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (values: any) => {
    try {
      const docRef = doc(db, "cms", "homepage");
      await updateDoc(docRef, {
        updates: values,
      });
      notifications.show({
        title: "Success",
        message: "Updates saved successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error saving updates:", error);
      notifications.show({
        title: "Error",
        message: "Failed to save updates",
        color: "red",
      });
    } finally {
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <Stack gap="md">
        <Title order={2} ta="center" c="teal">
          {form.values.title}
        </Title>
        {form.values.updates.map((update, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <div dangerouslySetInnerHTML={{ __html: update }} />
          </Card>
        ))}
        <Button 
          onClick={handleEditToggle} 
          leftSection={<IconPencil size={16} />} 
          radius="md"
          fullWidth
        >
          Edit
        </Button>
      </Stack>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSave)}>
      <Stack gap="lg" style={{ width: '100%' }}>
        <Title order={2}>Updates</Title>
        
        <TextInput
          label="Title"
          {...form.getInputProps('title')}
        />
        
        {form.values.updates.map((_, updateIndex) => (
          <Group key={updateIndex} align="flex-start" style={{ width: '100%' }}>
            <Stack style={{ flex: 1, width: '100%' }}>
              <RTEComponent
                label={`Update ${updateIndex + 1}`}
                content={form.values.updates[updateIndex]}
                onChange={(value) => form.setFieldValue(`updates.${updateIndex}`, value)}
              />
            </Stack>
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem('updates', updateIndex)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}
        
        <Button onClick={addUpdateDetail} leftSection={<IconPlus size={16} />}>
          Add Update Detail
        </Button>
        <Group>
          <Button type="submit" leftSection={<IconCheck size={16} />}>
            Save Changes
          </Button>
          <Button color="red" onClick={handleEditToggle} leftSection={<IconX size={16} />}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
