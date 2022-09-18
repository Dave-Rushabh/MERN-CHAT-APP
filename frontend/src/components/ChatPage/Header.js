import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { BsSearch } from 'react-icons/bs';
import { FaBell } from 'react-icons/fa';
import { IoReturnUpBack } from 'react-icons/io5';
import ProfileModal from './ProfileModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  setChatsToStore,
  setCurrentUserCredentialsToStore,
  setSelectedChatToStore,
} from '../../redux/slices/chatReducer';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';

const Header = ({ currentUser }) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { name, pic, token } = currentUser;
  const { allChats } = useSelector((state) => state.chatReducer);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch(setCurrentUserCredentialsToStore());
    toast({
      title: 'Logout successful !',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };

  const handleSearch = async () => {
    if (search === '') {
      toast({
        title: 'Nothing entered to search',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user/search?search=${search}`,
        config,
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!allChats.find((chat) => chat._id === data._id)) {
        dispatch(setChatsToStore([...allChats, data]));
      }
      dispatch(setSelectedChatToStore(data));
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        p="5px 10px"
        background="white"
        borderBottomWidth="2px"
        borderBottomColor="#023047"
      >
        <Button variant="ghost" onClick={onOpen}>
          <BsSearch color="#023047" />
          <Text
            color="#023047"
            fontWeight="thin"
            pl="4"
            display={{ base: 'none', md: 'flex' }}
          >
            Search
          </Text>
        </Button>
        <Text fontSize="2xl" fontFamily="cursive" color="#023047">
          Converse
        </Text>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          width="10%"
        >
          <Menu>
            <MenuButton p={1} m={1}>
              <FaBell fontSize="1.3rem" color="#023047" />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton variant="ghost" p={1}>
              <Avatar size="sm" cursor="pointer" name={name} src={pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal currentUser={currentUser}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" borderBottomColor="#023047">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box sx={{ color: '#023047' }}> Search users </Box>
              <Button onClick={onClose}>
                <IoReturnUpBack color="#023047" fontSize="1.35rem" />
              </Button>
            </Box>
          </DrawerHeader>
          <DrawerBody my={4}>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button color="#023047" onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  onUserSelect={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
