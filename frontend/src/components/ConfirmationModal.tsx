import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useToast,

} from "@chakra-ui/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColorScheme?: string;
  isLoading?: boolean;
  successMessage?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColorScheme = "red",
  isLoading = false,
  successMessage,
}: ConfirmationModalProps) {
  const toast = useToast();

  const handleConfirm = async () => {
    try {
      await onConfirm();
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            colorScheme={confirmColorScheme}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
