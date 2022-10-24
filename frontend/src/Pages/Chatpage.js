import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import Header from '../components/ChatPage/Header';
import MyChats from '../components/ChatPage/MyChats';
import ChatBox from '../components/ChatPage/ChatBox';

const Chatpage = () => {
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false);

  // destructure the chatReducer's state from here and use it as and when required
  const { currentUser, notifications } = useSelector(
    (state) => state.chatReducer,
  );

  useEffect(() => {
    if (currentUser === null) {
      navigate('/');
    }
  }, [currentUser]);

  return (
    <>
      <Box width="100%">
        {currentUser && (
          <Header currentUser={currentUser} notifications={notifications} />
        )}
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          height="93vh"
          padding="24px"
          backgroundImage="radial-gradient(ellipse farthest-corner at 120% 180%, #3c84cc 0%, #8ecae6 70%, #4e95d3 70%)"
        >
          {currentUser && <MyChats fetchAgain={fetchAgain} />}
          {currentUser && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Chatpage;
