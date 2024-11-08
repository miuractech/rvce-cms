import { MiuracImage } from "../../miurac-images/miurac-image";
import { RTEComponent } from "../../components/RTE";
import { IconPlus, IconPencil } from "@tabler/icons-react";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import {
  Title,
  Text,
  Stack,
  Card,
  Button,
  Group,
  TextInput,
  Modal,
  ActionIcon,
  Badge,
  LoadingOverlay,
} from "@mantine/core";
import { DepartmentData, IdepartmentStatus } from "./Departments";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

interface DepartmentSectionProps {
  data: DepartmentData;
  index: number;
}

export function DepartmentSection({ data }: DepartmentSectionProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      id: data.id || "",
      title: data.title || "",
      description: data.description || "",
      image: data.image || "",
      status: data.status || "unpublished",
    },
    validate: yupResolver(
      yup.object().shape({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        image: yup.string().required("Image is required"),
        status: yup
          .string()
          .oneOf(["published", "unpublished", "deleted"])
          .required(),
      })
    ),
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "departments", data.id), {
        ...values,
      });

      notifications.show({
        title: "Success",
        message: isNewDepartment
          ? "Department created successfully"
          : "Department updated successfully",
        color: "green",
      });
      setModalOpened(false);
    } catch (error) {
      console.log(error);

      notifications.show({
        title: "Error",
        message: isNewDepartment
          ? "Failed to create department"
          : "Failed to update department",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: IdepartmentStatus) => {
    setIsStatusUpdating(true);
    try {
      await setDoc(doc(db, "departments", data.id), {
        ...form.values,
        status: newStatus,
      });
      form.setFieldValue("status", newStatus);
      notifications.show({
        title: "Success",
        message: "Department status updated successfully",
        color: "green",
      });
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error",
        message: "Failed to update department status",
        color: "red",
      });
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const isNewDepartment = !data.title && !data.description && !data.image;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'green';
      case 'unpublished':
        return 'yellow';
      case 'deleted':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getNextStatus = (currentStatus: IdepartmentStatus): IdepartmentStatus => {
    switch (currentStatus) {
      case 'unpublished':
        return 'published' as IdepartmentStatus;
      case 'published':
        return 'deleted' as IdepartmentStatus;
      default:
        return 'unpublished' as IdepartmentStatus;
    }
  };

  return (
    <div className="p-2">
      {isNewDepartment ? (
        <Button
          fullWidth
          onClick={() => setModalOpened(true)}
          leftSection={<IconPlus />}
        >
          Add New Department
        </Button>
      ) : (
        <Card withBorder p="lg" w={300} pos="relative">
          <ActionIcon 
            onClick={() => setModalOpened(true)}
            pos="absolute"
            top={5}
            right={5}
            style={{ zIndex: 2 }}
          >
            <IconPencil size={16} />
          </ActionIcon>

          {form.values.image && (
            <img
              src={form.values.image}
              alt={form.values.title}
              className="w-full object-cover"
            />
          )}

          <Title order={3} mt="md" lineClamp={1}>
            {form.values.title}
          </Title>
          <Text
            mt="xs"
            lineClamp={3}
            dangerouslySetInnerHTML={{ __html: form.values.description }}
          />
          
          <Badge 
            color={getStatusColor(form.values.status)} 
            mt="xs"
            style={{ cursor: 'pointer' }}
            onClick={() => handleStatusChange(getNextStatus(form.values.status as IdepartmentStatus))}
          >
            {form.values.status}
          </Badge>

          <Group mt="md">
            <Button 
              onClick={() => navigate(`/departments/${data.id}`)}
            >
              View Department
            </Button>
          </Group>
        </Card>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={isNewDepartment ? "Add Department" : "Edit Department"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={isSubmitting} />
          <Stack gap="md">
            <div>
              {form.values.image ? (
                <div
                  className="relative"
                  onClick={() => form.setFieldValue("image", "")}
                >
                  <img
                    src={form.values.image}
                    alt={form.values.title}
                    className="w-full h-[300px] object-cover"
                  />
                </div>
              ) : (
                <MiuracImage
                  editConfig={null}
                  setUrlFunc={(url) =>
                    typeof url === "string"
                      ? form.setFieldValue("image", url)
                      : null
                  }
                  updateFirestore={true}
                  allowMultiple={false}
                  buttonComponent={
                    <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 cursor-pointer">
                      <div className="flex flex-col items-center gap-1">
                        <IconPlus size={24} className="text-gray-500" />
                        <span className="text-sm text-gray-500">
                          Add Department Image
                        </span>
                      </div>
                    </div>
                  }
                />
              )}
            </div>

            <TextInput label="Title" {...form.getInputProps("title")} />

            <RTEComponent
              label="Description"
              content={form.values.description}
              onChange={(value) => form.setFieldValue("description", value)}
            />

            <Group justify="right">
              <Button
                type="button"
                variant="subtle"
                onClick={() => setModalOpened(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" color="blue" loading={isSubmitting}>
                {isNewDepartment ? "Add Department" : "Save Changes"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}
