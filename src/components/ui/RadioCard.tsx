import { Box } from "@chakra-ui/react";

interface RadioCardProps {
  value: string;
  isChecked: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export const RadioCard = ({
  value,
  isChecked,
  onChange,
  children,
}: RadioCardProps) => {
  return (
    <Box
      as="label"
      cursor="pointer"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      px={4}
      py={2}
      bg={isChecked ? "teal.600" : "transparent"}
      color={isChecked ? "white" : "inherit"}
      borderColor={isChecked ? "teal.600" : "gray.300"}
      transition="0.2s"
      onClick={() => onChange(value)}
      _hover={{
        borderColor: "teal.400",
      }}
    >
      {children}
    </Box>
  );
};
