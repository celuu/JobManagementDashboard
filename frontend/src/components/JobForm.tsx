import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

interface JobFormProps {
  onSubmit: (name: string) => Promise<void>;
}

export function JobForm({ onSubmit }: JobFormProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = name.trim().length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedName);
      setName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canSubmit) {
      handleSubmit();
    }
  };

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="xl"
      p={5}
      width="100%"
    >
      <Heading size="sm" mb={3}>
        Create Job
      </Heading>
      <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
        <Input
          data-testid="new-job-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="e.g., ML Model Training"
        />
        <Button
          data-testid="create-job-btn"
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={!canSubmit}
          minW={{ base: "100%", sm: "auto" }}
        >
          Create
        </Button>
      </Stack>

        <Text fontSize="sm" color="gray.500" mt={2}>
          Name cannot be empty.
        </Text>

    </Box>
  );
}
