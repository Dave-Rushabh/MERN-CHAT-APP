import React, { useEffect, useState } from 'react';
import {
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  ModalFooter,
  Button,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import UserListItem from '../ChatPage/UserListItem';
import UserBadgeItem from './UserBadgeItem';
import { setChatsToStore } from '../../redux/slices/chatReducer';

const GroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const { currentUser, selectedChat, allChats } = useSelector(
    (state) => state.chatReducer,
  );

  useEffect(() => {
    return () => {
      setSelectedUsers([]);
      console.log('testing unmounting');
    };
  }, []);

  const handleSearch = async (query) => {
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user/search?search=${query}`,
        config,
      );
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: 'Could not find the users to add',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToDelete._id),
    );
    toast({
      title: `${userToDelete.name} removed`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };

  const handleGroup = (userToAdd) => {
    if (
      selectedUsers.filter((selectedUser) => selectedUser._id === userToAdd._id)
        .length > 0
    ) {
      toast({
        title: `${userToAdd.name} is already added`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setSearchUser('');
      return;
    }
    setSelectedUsers((prev) => [...prev, userToAdd]);
    setSearchUser('');
    toast({
      title: `${userToAdd.name} added`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: `Please fill all the details to create a group`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config,
      );

      dispatch(setChatsToStore([data, ...allChats]));
      onClose();
      toast({
        title: `Group created successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      console.log(error, 'error');
      toast({
        title: `${error.response.data.message || 'Group could not be created'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group name"
                my={3}
                onChange={(event) => setGroupChatName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users : e.g. Rushabh, Gaurav.."
                my={3}
                onChange={(event) => {
                  handleSearch(event.target.value);
                  setSearchUser(event.target.value);
                }}
                value={searchUser}
              />
            </FormControl>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              width="100%"
              flexWrap="wrap"
            >
              {selectedUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleDelete={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              searchUser &&
              searchResults
                ?.slice(0, 4)
                ?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    onUserSelect={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
