import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { IoReturnUpBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from '../ChatPage/ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';

const SingleChat = ({
  fetchAgain,
  setFetchAgain,
  setSelectedChatToStore,
  currentUser,
  selectedChat,
}) => {
  const dispatch = useDispatch();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="cursive"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
          >
            <Button
              display={{ base: 'flex', md: 'none' }}
              onClick={() => dispatch(setSelectedChatToStore(''))}
            >
              <IoReturnUpBack color="#023047" fontSize="1.35rem" />
            </Button>
            {!selectedChat?.isGroupChat ? (
              <>
                <Text fontSize="large">
                  {getSender(currentUser, selectedChat?.users)}
                </Text>
                <ProfileModal
                  currentUser={getSenderFull(currentUser, selectedChat?.users)}
                />
              </>
            ) : (
              <>
                <Text fontSize="large" m={{ base: 5, md: 0 }}>
                  {selectedChat?.chatName}
                </Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  setSelectedChatToStore={setSelectedChatToStore}
                  currentUser={currentUser}
                  selectedChat={selectedChat}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
            backgroundColor="#f2f2f2"
          >
            Messages Here...
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize="2xl" pb={3} fontFamily="cursive">
            Select a chat to start chatting...
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
