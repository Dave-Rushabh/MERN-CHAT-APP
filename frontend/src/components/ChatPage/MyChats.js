import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setChatsToStore,
  setSelectedChatToStore,
} from '../../redux/slices/chatReducer';
import { BsFillPeopleFill } from 'react-icons/bs';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupModal from './GroupModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { currentUser, selectedChat, allChats } = useSelector(
    (state) => state.chatReducer,
  );
  const dispatch = useDispatch();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const { data } = await axios.get(`/api/chat`, config);
      dispatch(setChatsToStore(data));
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(currentUser);
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
        flexDirection="column"
        alignItems="center"
        p={3}
        bg="white"
        width={{ base: '100%', md: '37%', lg: '30%' }}
        borderRadius="lg"
      >
        <Box
          pb={3}
          fontSize={{ base: '20px', md: '20px', lg: '20px' }}
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          color="#023047"
        >
          Chats
          <GroupModal>
            <Button
              display="flex"
              fontSize={{ base: '10px', md: '15px', sm: '10px' }}
              rightIcon={<BsFillPeopleFill color="#023047" />}
              color="#023047"
            >
              New Group
            </Button>
          </GroupModal>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          p={3}
          width="100%"
          height="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {allChats ? (
            <Stack overflowY="scroll">
              {allChats.map((chat) => (
                <Box
                  onClick={() => dispatch(setSelectedChatToStore(chat))}
                  cursor="pointer"
                  bg={selectedChat === chat ? '#023047' : '#a2d2ff'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  _hover={{
                    bg: selectedChat !== chat && '#ef233c',
                    color: selectedChat !== chat && 'white',
                  }}
                >
                  <Text
                    fontFamily="cursive"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat?.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
