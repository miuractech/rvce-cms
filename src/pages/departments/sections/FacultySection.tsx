import React, { useState } from "react";
import { FacultyMember } from "../departmentPage";
import {
  Box,
  Title,
  Button,
  Stack,
  ActionIcon,
  TextInput,
  Group,
  TagsInput,
  Select,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { MiuracImage } from "../../../miurac-images/miurac-image";
import {
  IconX,
  IconPlus,
  IconPencil,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandGithub,
} from "@tabler/icons-react";
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import * as yup from "yup";

interface FacultyProps {
  data: FacultyMember[];
}

const facultySchema = yup.object().shape({
  faculty: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Name is required"),
      position: yup.string().required("Position is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      image: yup.string(),
      specializations: yup.array().of(yup.string()),
      title: yup.string().required("Title is required"),
      phone: yup.string().matches(/^\+?[\d\s-]+$/, "Invalid phone number"),
      socials: yup.array().of(
        yup.object().shape({
          link: yup.string().url("Must be a valid URL"),
          socialMedia: yup.string(),
        })
      ),
    })
  ),
});

const socialMediaOptions = [
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: <IconBrandLinkedin size={16} />,
  },
  { value: "twitter", label: "Twitter", icon: <IconBrandTwitter size={16} /> },
  { value: "github", label: "GitHub", icon: <IconBrandGithub size={16} /> },
];

export const FacultySection: React.FC<FacultyProps> = ({ data }) => {
  const [editingIndices, setEditingIndices] = useState<number[]>([]);
  const { depId } = useParams();

  const form = useForm<{ faculty: FacultyMember[] }>({
    initialValues: {
      faculty:
        data.length > 0
          ? data.map((f) => ({
              ...f,
              socials: f.socials || [],
            }))
          : [],
    },
    validate: yupResolver(facultySchema),
  });

  const handleIndividualSubmit = async (index: number) => {
    const validation = await form.validate();
    if (validation.hasErrors) {
      return;
    }

    if (depId) {
      try {
        const deptRef = doc(db, "departments", depId);
        const updatedFaculty = [...form.values.faculty];

        await updateDoc(deptRef, {
          faculty: updatedFaculty,
        });
        setEditingIndices(editingIndices.filter((i) => i !== index));
      } catch (error) {
        console.error("Error updating faculty:", error);
      }
    }
  };

  const handleAdd = () => {
    const newFaculty = {
      name: "",
      position: "",
      email: "",
      image: "",
      specializations: [],
      title: "",
      phone: "",
      socials: [],
    };

    const updatedFaculty = [...form.values.faculty, newFaculty];
    form.setFieldValue("faculty", updatedFaculty);
    setEditingIndices([...editingIndices, updatedFaculty.length - 1]);
  };

  const handleDelete = async (index: number) => {
    if (depId) {
      try {
        const updatedFaculty = [...form.values.faculty];
        updatedFaculty.splice(index, 1);

        const deptRef = doc(db, "departments", depId);
        await updateDoc(deptRef, {
          faculty: updatedFaculty,
        });

        form.setFieldValue("faculty", updatedFaculty);
        setEditingIndices(editingIndices.filter((i) => i !== index));
      } catch (error) {
        console.error("Error deleting faculty:", error);
      }
    }
  };

  const toggleEdit = (index: number) => {
    if (editingIndices.includes(index)) {
      setEditingIndices(editingIndices.filter((i) => i !== index));
    } else {
      setEditingIndices([...editingIndices, index]);
    }
  };

  return (
    <Stack gap="xl" maw={400}>
      <Group justify="space-between" align="center">
        <Title order={2}>Faculty Members</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
          Add Faculty
        </Button>
      </Group>

      {form.values.faculty.map((faculty, index) => (
        <Box
          key={index}
          p="md"
          style={{ border: "1px solid #eee", borderRadius: "8px" }}
        >
          {editingIndices.includes(index) ? (
            <Stack gap="md">
              <Box>
                {form.values.faculty[index].image ? (
                  <Box pos="relative" maw={200} mx="auto">
                    <img
                      src={form.values.faculty[index].image}
                      alt="Faculty"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <ActionIcon
                      pos="absolute"
                      top={5}
                      right={5}
                      variant="filled"
                      onClick={() => {
                        const faculty = [...form.values.faculty];
                        faculty[index].image = "";
                        form.setFieldValue("faculty", faculty);
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Box>
                ) : (
                  <MiuracImage
                    editConfig={null}
                    updateFirestore
                    allowMultiple={false}
                    setUrlFunc={(url) => {
                      if (typeof url === "string") {
                        const faculty = [...form.values.faculty];
                        faculty[index].image = url;
                        form.setFieldValue("faculty", faculty);
                      }
                    }}
                  />
                )}
              </Box>

              <TextInput
                label="Name"
                required
                {...form.getInputProps(`faculty.${index}.name`)}
              />

              <TextInput
                label="Title"
                required
                {...form.getInputProps(`faculty.${index}.title`)}
              />

              <TextInput
                label="Position"
                required
                {...form.getInputProps(`faculty.${index}.position`)}
              />

              <TextInput
                label="Email"
                required
                {...form.getInputProps(`faculty.${index}.email`)}
              />

              <TextInput
                label="Phone"
                {...form.getInputProps(`faculty.${index}.phone`)}
              />

              <TagsInput
                label="Specializations"
                placeholder="Enter specialization and press enter"
                {...form.getInputProps(`faculty.${index}.specializations`)}
              />

              <Stack>
                <Title order={6}>Social Media Links</Title>
                {faculty.socials?.map((social, socialIndex) => (
                  <Group key={socialIndex}>
                    <Select
                      style={{ width: "150px" }}
                      data={socialMediaOptions}
                      value={social.socialMedia}
                      onChange={(value) => {
                        const faculty = [...form.values.faculty];
                        if (!faculty[index].socials)
                          faculty[index].socials = [];
                        faculty[index].socials[socialIndex] = {
                          ...faculty[index].socials[socialIndex],
                          socialMedia: value || "",
                        };
                        form.setFieldValue("faculty", faculty);
                      }}
                      rightSection={
                        socialMediaOptions.find(
                          (opt) => opt.value === social.socialMedia
                        )?.icon
                      }
                    />
                    <TextInput
                      style={{ flex: 1 }}
                      placeholder="Social media link"
                      value={social.link}
                      onChange={(e) => {
                        const faculty = [...form.values.faculty];
                        if (!faculty[index].socials)
                          faculty[index].socials = [];
                        faculty[index].socials[socialIndex] = {
                          ...faculty[index].socials[socialIndex],
                          link: e.target.value,
                        };
                        form.setFieldValue("faculty", faculty);
                      }}
                    />
                    <ActionIcon
                      color="red"
                      onClick={() => {
                        const faculty = [...form.values.faculty];
                        faculty[index].socials?.splice(socialIndex, 1);
                        form.setFieldValue("faculty", faculty);
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const faculty = [...form.values.faculty];
                    if (!faculty[index].socials) faculty[index].socials = [];
                    faculty[index].socials.push({
                      link: "",
                      socialMedia: "",
                      icon: "",
                    });
                    form.setFieldValue("faculty", faculty);
                  }}
                >
                  Add Social Link
                </Button>
              </Stack>

              <Group>
                <Button
                  type="button"
                  onClick={() => handleIndividualSubmit(index)}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => toggleEdit(index)}
                >
                  Cancel
                </Button>
                {form.values.faculty.length > 1 && (
                  <Button
                    color="red"
                    type="button"
                    onClick={() => handleDelete(index)}
                  >
                    Remove
                  </Button>
                )}
              </Group>
            </Stack>
          ) : (
            <Stack>
              {faculty.image && (
                <img
                  src={faculty.image}
                  alt={faculty.name}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              )}
              <Title order={4} mt="sm">
                {faculty.name}
              </Title>
              <div>{faculty.title}</div>
              <div>{faculty.position}</div>
              <div>{faculty.email}</div>
              <div>{faculty.phone}</div>
              {faculty.specializations.length > 0 && (
                <div>
                  <strong>Specializations:</strong>
                  <ul>
                    {faculty.specializations.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
              {faculty.socials && faculty.socials.length > 0 && (
                <div>
                  <strong>Social Links:</strong>
                  <ul>
                    {faculty.socials.map((social, i) => (
                      <li key={i}>
                        {social.socialMedia.charAt(0).toUpperCase() +
                          social.socialMedia.slice(1)}
                        :{" "}
                        <a
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {social.link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                leftSection={<IconPencil size={16} />}
                onClick={() => toggleEdit(index)}
              >
                Edit
              </Button>
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  );
};
