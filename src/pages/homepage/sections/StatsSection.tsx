import { useForm } from '@mantine/form';
import { Stack, TextInput, Button, Title, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

interface StatsSectionProps {
  data: StatItem[];
}

export function StatsSection({ data }: StatsSectionProps) {
  const form = useForm({
    initialValues: {
      statistics: data.length > 0 ? data.map(item => ({
        number: item.value || '',
        rating: '',
        percentage: '',
        label: item.label || '',
        source: '',
      })) : [{
        number: '',
        rating: '',
        percentage: '',
        label: '',
        source: '',
      }]
    }
  });

  const addStat = () => {
    form.insertListItem('statistics', {
      number: '',
      rating: '',
      percentage: '',
      label: '',
      source: '',
    });
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack gap="lg">
        <Title order={2}>Statistics</Title>
        
        {form.values.statistics.map((_, index) => (
          <Group key={index} align="flex-start">
            <Stack style={{ flex: 1 }}>
              <TextInput
                label="Number"
                {...form.getInputProps(`statistics.${index}.number`)}
              />
              <TextInput
                label="Rating"
                {...form.getInputProps(`statistics.${index}.rating`)}
              />
              <TextInput
                label="Percentage"
                {...form.getInputProps(`statistics.${index}.percentage`)}
              />
              <TextInput
                label="Label"
                {...form.getInputProps(`statistics.${index}.label`)}
              />
              <TextInput
                label="Source"
                {...form.getInputProps(`statistics.${index}.source`)}
              />
            </Stack>
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem('statistics', index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}
        
        <Button leftSection={<IconPlus size={16} />} onClick={addStat}>
          Add Statistic
        </Button>
        <Button type="submit">Save Changes</Button>
      </Stack>
    </form>
  );
}