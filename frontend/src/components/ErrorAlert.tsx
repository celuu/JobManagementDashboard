import { Alert, AlertIcon } from "@chakra-ui/react";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Alert status="error" rounded="xl" data-testid="error-banner" width="100%">
      <AlertIcon />
      {message}
    </Alert>
  );
}
