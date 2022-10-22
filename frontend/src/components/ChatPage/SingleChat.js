import {
  Box,
  Button,
  FormControl,
  Input,
  Spinner,
  Text,
  Toast,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoReturnUpBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from '../ChatPage/ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import '../ChatPage/styles/SingleChat.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const END_POINT = 'http://localhost:5000'; // we give backend server link to frontend
let socket, selectedChatCompare;

const SingleChat = ({
  fetchAgain,
  setFetchAgain,
  setSelectedChatToStore,
  currentUser,
  selectedChat,
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    socket = io(END_POINT);
    /**
     * There is a method in server.js file's socket with the same name "setup".
     * which takes the current user data to give a seperate room to keep track of the notifications.
     */
    socket.emit('setup', currentUser);
    /**
     * The name to the socket io is given as "connection" in server.js file
     * When the server is started we then pass a callback function.
     * This function does whatever we want as soon as the socket io connection is established.
     */
    socket.on('connection', () => {
      setSocketConnected(true);
    });
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    const config = {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/messages/get-messages/${selectedChat?._id}`,
        config,
      );
      setMessages(data);
      setLoading(false);
      /**
       * Whenever the user selects a chat,the user will be added into that room in socket to receive the notifications
       */
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error while fetching the messages...',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      try {
        setNewMessage('');
        const { data } = await axios.post(
          `/api/messages/send-message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config,
        );
        /**
         * This below socket will be emitted when a new message is sent by the user.
         */
        socket.emit('new message', data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        toast({
          title: 'Message could not be sent..',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    }
  };

  const typingHandler = (event) => {
    setNewMessage(event.target.value);

    // typing indicatore logic here
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  /**
   * The below useEffect will render each time when the socket emits "message received" handler.
   */
  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

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
                  fetchMessages={fetchMessages}
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
            {loading ? (
              <Spinner
                size="xl"
                height={20}
                width={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <>
                <div className="messages">
                  <ScrollableChat
                    messages={messages}
                    currentUser={currentUser}
                  />
                </div>
              </>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="# E0E0E0"
                placeholder="Enter the message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
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
