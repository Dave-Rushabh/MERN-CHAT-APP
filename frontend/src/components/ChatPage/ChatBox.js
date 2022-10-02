import { Box } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { setSelectedChatToStore } from '../../redux/slices/chatReducer';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { currentUser, selectedChat } = useSelector(
    (state) => state.chatReducer,
  );
  return (
    <>
      <Box
        display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
        alignItems="center"
        flexDirection="column"
        p={3}
        bg="white"
        width={{ base: '100%', md: '60%', lg: '68%' }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <SingleChat
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          setSelectedChatToStore={setSelectedChatToStore}
          currentUser={currentUser}
          selectedChat={selectedChat}
        />
      </Box>
    </>
  );
};

export default ChatBox;
