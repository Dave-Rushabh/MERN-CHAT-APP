import React from 'react';
import {
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';

import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';

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
          m="10px 0px 15px 0px"
          borderRadius="lg"
        >
          <Text fontSize="2xl" color="white">
            Converse
          </Text>
        </Box>
        <Box
          p={4}
          margin="5px 0px 25px"
          bg="#023047"
          w="100%"
          borderRadius="lg"
          color="white"
        >
          <Tabs variant="soft-rounded">
            <TabList mb="1rem">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Homepage;
