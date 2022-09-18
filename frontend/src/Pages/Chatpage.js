import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import Header from '../components/ChatPage/Header';
import MyChats from '../components/ChatPage/MyChats';
import ChatBox from '../components/ChatPage/ChatBox';

const Chatpage = () => {
  const navigate = useNavigate();

  // destructure the chatReducer's state from here and use it as and when required
  const { currentUser } = useSelector((state) => state.chatReducer);

  useEffect(() => {
    if (currentUser === null) {
      navigate('/');
    }
  }, [currentUser]);

  return (
    <>
      <Box width="100%">
        {currentUser && <Header currentUser={currentUser} />}
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          height="95vh"
          padding="24px"
          backgroundColor="white"
        >
          {currentUser && <MyChats />}
          {currentUser && <ChatBox />}
        </Box>
      </Box>
    </>
  );
};

export default Chatpage;
