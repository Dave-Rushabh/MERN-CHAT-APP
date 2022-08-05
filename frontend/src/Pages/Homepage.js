import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";
const Homepage = () => {
  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={3}
          bg="#023047"
          w="100%"
          m="40px 0px 15px 0px"
          borderRadius="lg"
          border="3px"
          borderColor="blue.200"
        >
          <Text fontSize="2xl" color="white">
            Converse
          </Text>
        </Box>
      </Container>
    </>
  );
};

export default Homepage;
