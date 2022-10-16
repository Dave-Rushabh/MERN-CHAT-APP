import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ImEye } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  setSelectedChatToStore,
  currentUser,
  selectedChat,
  fetchMessages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const { chatName, users } = selectedChat;

  const handleRemove = async (userToRemove) => {
    const userId = userToRemove._id;
    const chatId = selectedChat._id;
    if (!userId) return;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${currentUser?.token}`,
      },
    };

    if (
      userId !== currentUser._id &&
      selectedChat.groupAdmin._id !== currentUser._id
    ) {
      toast({
        title: 'Only the admin can remove users !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        '/api/chat/remove-from-group',
        {
          chatId: chatId,
          userId: userId,
        },
        config,
      );
      userId === currentUser._id
        ? dispatch(setSelectedChatToStore())
        : dispatch(setSelectedChatToStore(data));
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      toast({
        title:
          userId === currentUser._id
            ? 'You Left the Group'
            : `${userToRemove.name} removed from the group`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: 'Could not delete the user',
        description: error?.response?.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: 'New group name can not be empty !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/chat/rename-group',
        {
          chatId: selectedChat._id,
          groupChatName: groupChatName,
        },
        config,
      );
      dispatch(setSelectedChatToStore(data));
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: 'Something went wrong !',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setRenameLoading(false);
    }

    setGroupChatName('');
  };

  const handleSearch = async (query) => {
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
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
        description: error?.response?.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  const handleGroupAdd = async (userToAdd) => {
    const userId = userToAdd._id;
    const chatId = selectedChat._id;
    if (!userId) return;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${currentUser?.token}`,
      },
    };

    if (selectedChat.groupAdmin._id !== currentUser._id) {
      toast({
        title: 'Only the admin can add new users !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setSearch('');
      return;
    }

    if (selectedChat.users.filter((user) => user._id === userId).length > 0) {
      toast({
        title: 'User is already in the group !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setSearch('');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        '/api/chat/add-to-group',
        {
          chatId: chatId,
          userId: userId,
        },
        config,
      );
      dispatch(setSelectedChatToStore(data));
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: `${userToAdd.name} added successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setSearch('');
    } catch (error) {
      toast({
        title: 'Could not find the users to add',
        description: error?.response?.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  const handleDisplayAllUsers = () => {
    const LoggedInUser = users.filter((user) => user._id === currentUser._id);
    const otherUsers = users.filter(
      (user) => user._id !== LoggedInUser[0]?._id,
    );
    const newUsersList = [...LoggedInUser, ...otherUsers];

    return newUsersList.map((user) => (
      <UserBadgeItem
        key={user._id}
        user={user}
        handleDelete={() => handleRemove(user)}
        currentUser={currentUser}
        selectedChat={selectedChat}
      />
    ));
  };

  const handleDisplayLimitedUsers = () => {
    const LoggedInUser = users.filter((user) => user._id === currentUser._id);
    const otherUsers = users.filter(
      (user) => user._id !== LoggedInUser[0]?._id,
    );
    const newUsersList = [...LoggedInUser, ...otherUsers.slice(0, 1)];

    return newUsersList.map((user) => (
      <UserBadgeItem
        key={user._id}
        user={user}
        handleDelete={() => handleRemove(user)}
        currentUser={currentUser}
        selectedChat={selectedChat}
      />
    ));
  };

  useEffect(() => {
    return () => {
      setGroupChatName();
      setShowAllUsers(false);
      setSearchResults([]);
      setSearch('');
    };
  }, [isOpen]);

  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<ImEye />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent pt={5}>
          <ModalHeader display="flex" justifyContent="center">
            {chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4} display="flex" justifyContent="space-between">
              <Box fontSize="large">
                {`Total users :  (${users?.length})`}
                <Box fontSize="large">{`Group Admin - ${selectedChat.groupAdmin.name}`}</Box>
              </Box>

              <Button
                onClick={() => setShowAllUsers(!showAllUsers)}
                width="20%"
              >
                {showAllUsers ? 'Fold' : 'See All'}
              </Button>
            </Box>
            <Box display="inline-flex" flexWrap="wrap" width="100%">
              {!showAllUsers
                ? handleDisplayLimitedUsers()
                : handleDisplayAllUsers()}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Rename the group"
                my={3}
                value={groupChatName}
                onChange={(event) => setGroupChatName(event.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="telegram"
                my={3}
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Rename
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add users : e.g. Rushabh, Gaurav.."
                my={3}
                onChange={(event) => {
                  handleSearch(event.target.value);
                  setSearch(event.target.value);
                }}
                value={search}
              />
            </FormControl>
            {loading ? (
              <Spinner />
            ) : (
              search &&
              searchResults
                ?.slice(0, 4)
                ?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    onUserSelect={() => handleGroupAdd(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button colorScheme="red" onClick={() => handleRemove(currentUser)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
