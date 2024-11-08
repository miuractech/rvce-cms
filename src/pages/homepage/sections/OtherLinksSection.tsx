import { useForm } from '@mantine/form';
import { Stack, TextInput, Button, Title, Group, ActionIcon, Textarea } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface OtherLinkItem {
  id: string;
  title: string;
  url: string;
  category?: string;
  icon?: string;
}

interface OtherLinksSectionProps {
  data: OtherLinkItem[];
}

export function OtherLinksSection({ data }: OtherLinksSectionProps) {
  const form = useForm({
    initialValues: {
      extracurriculars: {
        title: data.length > 0 ? data[0].title || '' : '',
        sections: data.length > 0 ? data.map(item => ({
          title: item.title || '',
          description: item.category || '',
          link: item.url || '',
        })) : [{
          title: '',
          description: '',
          link: '',
        }]
      }
    }
  });

  const addSection = () => {
    form.insertListItem('extracurriculars.sections', {
      title: "",
      description: "",
      link: "",
    });
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack gap="lg">
        <Title order={2}>Other Links</Title>
        
        <TextInput
          label="Main Title"
          {...form.getInputProps('extracurriculars.title')}
        />
        
        {form.values.extracurriculars.sections.map((_, index) => (
          <Group key={index} align="flex-start">
            <Stack style={{ flex: 1 }}>
              <TextInput
                label="Section Title"
                {...form.getInputProps(`extracurriculars.sections.${index}.title`)}
              />
              <Textarea
                label="Description"
                {...form.getInputProps(`extracurriculars.sections.${index}.description`)}
              />
              <TextInput
                label="Link"
                {...form.getInputProps(`extracurriculars.sections.${index}.link`)}
              />
            </Stack>
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem('extracurriculars.sections', index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}
        
        <Button leftSection={<IconPlus size={16} />} onClick={addSection}>
          Add Section
        </Button>
        <Button type="submit">Save Changes</Button>
      </Stack>
    </form>
  );
} 