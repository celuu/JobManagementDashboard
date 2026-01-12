import { memo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import type { Job, JobStatusType } from "../api/api";
import { ConfirmationModal } from "./ConfirmationModal";

interface JobCardProps {
  job: Job;
  statusOptions: JobStatusType[];
  onStatusChange: (jobId: number, status: JobStatusType) => void | Promise<void>;
  onDelete: (jobId: number) => void | Promise<void>;
}

function getStatusColor(status: JobStatusType | null) {
  switch (status) {
    case "PENDING":
      return "gray";
    case "RUNNING":
      return "blue";
    case "COMPLETED":
      return "green";
    case "FAILED":
      return "red";
    default:
      return "gray";
  }
}

export const JobCard = memo(function JobCard({
  job,
  statusOptions,
  onStatusChange,
  onDelete,
}: JobCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<JobStatusType>(
    job.current_status ?? "PENDING"
  );

  const handleDelete = async () => {
    await onDelete(job.id);
  };

  const handleEditClick = () => {
    setSelectedStatus(job.current_status ?? "PENDING");
    setIsEditingStatus(true);
  };

  const handleConfirmStatus = () => {
    onStatusChange(job.id, selectedStatus);
    setIsEditingStatus(false);
  };

  const handleCancelStatus = () => {
    setSelectedStatus(job.current_status ?? "PENDING");
    setIsEditingStatus(false);
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderColor="gray.200"
        rounded="xl"
        p={4}
        width="100%"
        minHeight="220px"
        display="flex"
        flexDirection="column"
        position="relative"
        data-testid={`job-row-${job.id}`}
      >
        <IconButton
          aria-label="Delete job"
          icon={<FiX />}
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={onOpen}
          position="absolute"
          top={2}
          right={2}
          data-testid={`delete-btn-${job.id}`}
        />

        <Stack spacing={3} flex="1" justify="space-between">
          <Box>
            <Text
              fontWeight="600"
              wordBreak="break-word"
              overflowWrap="break-word"
              whiteSpace="normal"
              pr={8}
            >
              {job.name}
            </Text>
            <HStack spacing={2} mt={1} flexWrap="wrap">
              <Text fontSize="sm" color="gray.600">
                Status:
              </Text>
              <Badge
                colorScheme={getStatusColor(job.current_status)}
                data-testid={`job-status-${job.id}`}
              >
                {job.current_status ?? "UNKNOWN"}
              </Badge>
              {!isEditingStatus && (
                <IconButton
                  aria-label="Edit status"
                  icon={<FiEdit2 />}
                  size="xs"
                  variant="ghost"
                  onClick={handleEditClick}
                  colorScheme="blue"
                />
              )}
            </HStack>
            <Text fontSize="sm" color="gray.500" mt={2} wordBreak="break-word">
              Created at: {new Date(job.created_at).toLocaleString()}
            </Text>
          
          </Box>

          <Stack spacing={2} width="100%">
            {isEditingStatus ? (
              <>
                <Select
                  size="sm"
                  data-testid={`status-select-${job.id}`}
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as JobStatusType)
                  }
                  width="100%"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>

                <HStack spacing={2} width="100%">
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={handleConfirmStatus}
                    leftIcon={<FiCheck />}
                    flex="1"
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelStatus}
                    leftIcon={<FiX />}
                    flex="1"
                  >
                    Cancel
                  </Button>
                </HStack>
              </>
            ) : null}
          </Stack>
        </Stack>
      </Box>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Delete Job"
        message={`Are you sure you want to delete "${job.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        successMessage={`Job "${job.name}" deleted successfully`}
      />
    </>
  );
});
