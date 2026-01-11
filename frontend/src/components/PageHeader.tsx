import { Box, Heading, Text } from "@chakra-ui/react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <Box>
      <Heading size="lg">{title}</Heading>
      <Text color="gray.600" mt={2}>
        {description}
      </Text>
    </Box>
  );
}
