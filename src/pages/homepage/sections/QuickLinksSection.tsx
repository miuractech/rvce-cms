import { useForm } from '@mantine/form';
import { Stack, TextInput, Button, Title, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { MiuracImage } from '../../../miurac-images/miurac-image';

interface QuickLinkItem {
  id: string;
  title: string; 
  url: string;
  icon?: string;
}

interface QuickLinksSectionProps {
  data: QuickLinkItem[];
}

export function QuickLinksSection({ data }: QuickLinksSectionProps) {
  const form = useForm({
    initialValues: {
      quick_links: data.length > 0 ? data.map(item => ({
        title: item.title || '',
        url: item.url || '',
        icon: item.icon || ''
      })) : [{
        title: '',
        url: '',
        icon: ''
      }]
    }
  });

  const addQuickLink = () => {
    form.insertListItem('quick_links', { title: '', url: '', icon: '' });
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack gap="lg">
        <Title order={2}>Quick Links</Title>
        
        {form.values.quick_links.map((_, index) => (
          <Group key={index} align="flex-start">
            <Stack style={{ flex: 1 }}>
              <TextInput
                label="Title"
                {...form.getInputProps(`quick_links.${index}.title`)}
              />
              <TextInput
                label="URL"
                {...form.getInputProps(`quick_links.${index}.url`)}
              />
              <MiuracImage
                editConfig={null}
                setUrlFunc={(url) => 
                  typeof url === 'string' 
                    ? form.setFieldValue(`quick_links.${index}.icon`, url)
                    : null
                }
                updateFirestore={true}
                allowMultiple={false}
              />
            </Stack>
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem('quick_links', index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}
        
        <Button leftSection={<IconPlus size={16} />} onClick={addQuickLink}>
          Add Quick Link
        </Button>
        <Button type="submit">Save Changes</Button>
      </Stack>
    </form>
  );
}