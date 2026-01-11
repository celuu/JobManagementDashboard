import { Box, Button, Center, HStack, Text, VStack } from "@chakra-ui/react";

interface PaginationProps {
  totalPages: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ totalPages, page, pageSize, onPageChange }: PaginationProps) {
  return (
    <Box width="100%">
      <Center>
        <VStack>
          <Text textAlign="center">
            Page {page} of {totalPages} ({pageSize} jobs per page)
          </Text>
          <HStack>
            <Button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              isDisabled={page === 1}
            >
              Previous
            </Button>

            <Button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              isDisabled={page === totalPages}
            >
              Next
            </Button>
          </HStack>
        </VStack>
      </Center>
    </Box>
  );
}