import { useForm } from '@mantine/form';
import { Stack, TextInput, Button, Title, Group, ActionIcon, Textarea } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { MiuracImage } from '../../../miurac-images/miurac-image';
interface AccreditationItem {
  id: string;
  name: string;
  logo: string;
  description?: string;
}

interface AccreditationsSectionProps {
  data: AccreditationItem[];
}

export function AccreditationsSection({ data }: AccreditationsSectionProps) {
  const form = useForm({
    initialValues: {
      accreditations: data.length > 0 ? data.map(item => ({
        name: item.name || '',
        description: item.description || '',
        logo: item.logo || ''
      })) : [{
        name: '',
        description: '',
        logo: ''
      }]
    }
  });

  const addAccreditation = () => {
    form.insertListItem('accreditations', { 
      name: '', 
      description: '',
      logo: ''
    });
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack gap="lg">
        <Title order={2}>Accreditations</Title>
        
        {form.values.accreditations.map((_, index) => (
          <Group key={index} align="flex-start">
            <Stack style={{ flex: 1 }}>
              <TextInput
                label="Name"
                {...form.getInputProps(`accreditations.${index}.name`)}
              />
              <Textarea
                label="Description"
                {...form.getInputProps(`accreditations.${index}.description`)}
              />
              <MiuracImage
                editConfig={null}
                setUrlFunc={(url) => 
                  typeof url === 'string' 
                    ? form.setFieldValue(`accreditations.${index}.logo`, url)
                    : null
                }
                updateFirestore={true}
                allowMultiple={false}
              />
            </Stack>
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem('accreditations', index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}
        
        <Button leftSection={<IconPlus size={16} />} onClick={addAccreditation}>
          Add Accreditation
        </Button>
        <Button type="submit">Save Changes</Button>
      </Stack>
    </form>
  );
}