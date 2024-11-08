import { useState } from "react";
import {
  Box,
  Button,
  Group,
  Stack,
  Title,
  SegmentedControl,
  ActionIcon,
} from "@mantine/core";
import { GenericCMSInput, ICMSInput } from "./genericCMSInputField";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";

interface GenericCMSProps {
  value: ICMSInput[];
  setValue: (value: ICMSInput[]) => void;
  title?: string;
}

export function GenericCMS({ value, setValue, title }: GenericCMSProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sections, setSections] = useState<ICMSInput[]>(value);

  const handleAddSection = () => {
    const newSection: ICMSInput = {
      type: "rte",
      value: "",
      title: "",
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    setValue(newSections);
    setEditingIndex(sections.length);
  };

  const handleSectionChange = (value: ICMSInput, index: number) => {
    const newSections = [...sections];
    newSections[index] = value;
    setSections(newSections);
    setValue(newSections);
  };

  const handleSectionTypeChange = (type: ICMSInput["type"], index: number) => {
    const currentSection = sections[index];
    let newSection: ICMSInput;

    switch (type) {
      case "rte":
        newSection = {
          type: "rte",
          value: currentSection.type === "rte" || currentSection.type === "imgRte" ? currentSection.value : "",
          title: currentSection.title,
        };
        break;
      case "imgRte":
        newSection = {
          type: "imgRte",
          value: currentSection.type === "rte" || currentSection.type === "imgRte" ? currentSection.value : "",
          title: currentSection.title,
          imagePosition: "left",
          imageUrl: "",
        };
        break;
      case "gallery":
        newSection = {
          type: "gallery",
          title: currentSection.title,
          imageUrls: [],
        };
        break;
      case "carousel":
        newSection = {
          type: "carousel",
          title: currentSection.title,
          imageUrls: [],
        };
        break;
      default:
        return;
    }

    const newSections = [...sections];
    newSections[index] = newSection;
    setSections(newSections);
    setValue(newSections);
  };

  const handleDeleteSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
    setValue(newSections);
    setEditingIndex(null);
  };

  const renderSectionContent = (section: ICMSInput) => {
    switch (section.type) {
      case "rte":
      case "imgRte":
        return (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: section.title ?? "" }}
              className="text-2xl font-semibold text-gray-800 mb-4"
            />
            <div
              dangerouslySetInnerHTML={{ __html: section.value }}
              className="text-gray-600 leading-relaxed mb-4"
            />
            {section.type === "imgRte" && section.imageUrl && (
              <Box className="mt-4">
                <img
                  src={section.imageUrl}
                  alt=""
                  className="w-full rounded-lg object-cover"
                />
              </Box>
            )}
          </>
        );
      case "gallery":
      case "carousel":
        return (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: section.title ?? "" }}
              className="text-2xl font-semibold text-gray-800 mb-4"
            />
            <div className="grid grid-cols-3 gap-4">
              {section.imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt=""
                  className="w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box p="md">
      <Stack gap="xl" w="100%">
        {sections.map((section, index) => (
          <Box key={index} pos="relative">
            <ActionIcon
              color="red"
              pos="absolute"
              top={8}
              right={8}
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this section?"
                  )
                ) {
                  handleDeleteSection(index);
                }
              }}
              style={{ zIndex: 10 }}
            >
              <IconTrash size={16} />
            </ActionIcon>
            {editingIndex === index ? (
              <>
                <SegmentedControl
                  mb="md"
                  data={[
                    { label: "Text Only", value: "rte" },
                    { label: "Text with Image", value: "imgRte" },
                    { label: "Gallery", value: "gallery" },
                    { label: "Carousel", value: "carousel" }
                  ]}
                  value={section.type}
                  onChange={(value) =>
                    handleSectionTypeChange(value as ICMSInput["type"], index)
                  }
                />
                <GenericCMSInput
                  value={section}
                  onChange={(value) => handleSectionChange(value, index)}
                />
                <Group mt="sm">
                  <Button onClick={() => setEditingIndex(null)}>Save</Button>
                </Group>
              </>
            ) : (
              <Box className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 w-full">
                {renderSectionContent(section)}
                <Button
                  leftSection={<IconPencil size={16} />}
                  onClick={() => setEditingIndex(index)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                >
                  Edit
                </Button>
              </Box>
            )}
          </Box>
        ))}
        <Group justify="space-between" align="center">
          {title && <Title order={2}>{title}</Title>}
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddSection}
          >
            Add Section
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
