import React, { useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUserCredentialsToStore } from '../redux/slices/chatReducer';

const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.chatReducer);
  useEffect(() => {
    dispatch(setCurrentUserCredentialsToStore());
  }, []);

  useEffect(() => {
    if (currentUser !== null) {
      navigate('/chats');
    }
  }, [currentUser]);

  return (
    <>
      <div
        style={{
          width: '100%',
          backgroundImage:
            'radial-gradient(ellipse farthest-corner at 120% 180%, #3c84cc 0%, #8ecae6 70%, #4e95d3 70%)',
        }}
      >
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
      </div>
    </>
  );
};

export default Homepage;
