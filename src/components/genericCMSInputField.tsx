import { Box, Stack, Text, Select, TextInput } from "@mantine/core";
import { RTEComponent } from "./RTE";
import { MiuracImage } from "../miurac-images/miurac-image";

export type ICMSInput =
  | {
      type: "rte";
      value: string;
      label?: string;
      title?: string;
    }
  | {
      type: "imgRte";
      value: string;
      label?: string;
      title?: string;
      imagePosition: "left" | "right";
      imageUrl: string;
    }
  | {
      type: "gallery";
      title?: string;
      imageUrls: string[];
    }
  | {
      type: "carousel";
      title?: string;
      imageUrls: string[];
    };

export const GenericCMSInput: React.FC<{
  updateFirestore?: boolean;
  editConfig?: any;
  onChange: (value: ICMSInput) => void;
  value: ICMSInput;
}> = ({ onChange, value, editConfig, updateFirestore }) => {
  const { type, title } = value;

  const handleRTEChange = (content: string) => {
    if (type === "rte" || type === "imgRte") {
      onChange({
        ...value,
        value: content,
      });
    }
  };

  const handleImageChange = (url: string) => {
    if (type === "imgRte") {
      onChange({
        ...value,
        imageUrl: url,
      });
    }
  };

  const handleMultipleImagesChange = (urls: string[]) => {
    if (type === "gallery" || type === "carousel") {
      onChange({
        ...value,
        imageUrls: urls,
      });
    }
  };

  const renderContent = () => {
    switch (type) {
      case "rte":
        return (
          <>
            <Text size="sm" fw={500}>
              Content
            </Text>
            <RTEComponent content={value.value} onChange={handleRTEChange} />
          </>
        );

      case "imgRte":
        return (
          <Stack>
            <Text size="sm" fw={500}>
              Image Position
            </Text>
            <Select
              data={[
                { label: "Image Left", value: "left" },
                { label: "Image Right", value: "right" },
              ]}
              value={value.imagePosition}
              onChange={(position) => {
                if (position) {
                  onChange({
                    ...value,
                    imagePosition: position as "left" | "right",
                  });
                }
              }}
            />
            <Box>
              <Text size="sm" fw={500}>
                Image
              </Text>
              <MiuracImage
                updateFirestore={updateFirestore || false}
                editConfig={editConfig}
                setUrlFunc={(url) => {
                  if (typeof url === "string") {
                    handleImageChange(url);
                  }
                }}
                image={value.imageUrl}
              />
              <Text size="sm" fw={500} mt="md">
                Content
              </Text>
              <RTEComponent content={value.value} onChange={handleRTEChange} />
            </Box>
          </Stack>
        );

      case "gallery":
      case "carousel":
        return (
          <Stack>
            <Text size="sm" fw={500}>
              Images
            </Text>
            {value.imageUrls.map((url, index) => (
              <Box key={index}>
                <MiuracImage
                  updateFirestore={updateFirestore || false}
                  editConfig={editConfig}
                  setUrlFunc={(newUrl) => {
                    if (typeof newUrl === "string") {
                      const newUrls = [...value.imageUrls];
                      newUrls[index] = newUrl;
                      handleMultipleImagesChange(newUrls);
                    }
                  }}
                  image={url}
                />
              </Box>
            ))}
            <MiuracImage
              updateFirestore={updateFirestore || false}
              editConfig={editConfig}
              setUrlFunc={(url) => {
                if (typeof url === "string") {
                  handleMultipleImagesChange([...value.imageUrls, url]);
                }
              }}
            />
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Stack gap="xs">
      {"title" in value && (
        <>
          <Text size="sm" fw={500}>
            Title
          </Text>
          <RTEComponent
            content={title ?? ""}
            onChange={(newTitle) => onChange({ ...value, title: newTitle })}
          />
        </>
      )}
      {"label" in value && (
        <>
          <Text size="sm" fw={500}>
            Label
          </Text>
          <TextInput
            value={value.label}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
          />
        </>
      )}
      <Box>
        {renderContent()}
      </Box>
    </Stack>
  );
};
