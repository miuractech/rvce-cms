import { useForm } from '@mantine/form';
import { Stack, TextInput, Button, Title, Group, ActionIcon, Textarea } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { MiuracImage } from '../../../miurac-images/miurac-image';
interface SuccessStoryItem {
  id: string;
  title: string;
  content: string;
  image: string;
  author?: string;
}

interface SuccessStoriesSectionProps {
  data: SuccessStoryItem[];
}

export function SuccessStoriesSection({ data }: SuccessStoriesSectionProps) {
  const form = useForm({
    initialValues: {
      success_stories: data.length > 0 ? data.map(item => ({
        title: item.title || '',
        content: item.content || '',
        image: item.image || '',
        author: item.author || ''
      })) : [{
        title: '',
        content: '',
        image: '',
        author: ''
      }]
    }
  });

  const addStory = () => {
    form.insertListItem('success_stories', {
      title: '',
      content: '',
      image: '',
      author: ''
    });
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack gap="lg">
        <Title order={2}>Success Stories</Title>
        
        {form.values.success_stories.map((_, index) => (
          <Group key={index} align="flex-start">
            <Stack style={{ flex: 1 }}>
              <TextInput
                label="Title"
                {...form.getInputProps(`success_stories.${index}.title`)}
              />
              <TextInput
                label="Author"
                {...form.getInputProps(`success_stories.${index}.author`)}
              />
              <Textarea
                label="Content"
                {...form.getInputProps(`success_stories.${index}.content`)}
              />
              <MiuracImage
                editConfig={null}
                setUrlFunc={(url) => 
                  typeof url === 'string' 
                    ? form.setFieldValue(`success_stories.${index}.image`, url)
                    : null
                }
                updateFirestore={true}
                allowMultiple={false}
              />
            </Stack>
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem('success_stories', index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}
        
        <Button leftSection={<IconPlus size={16} />} onClick={addStory}>
          Add Success Story
        </Button>
        <Button type="submit">Save Changes</Button>
      </Stack>
    </form>
  );
}