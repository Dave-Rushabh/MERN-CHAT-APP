import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { BsSearch } from 'react-icons/bs';
import { FaBell } from 'react-icons/fa';
import ProfileModal from './ProfileModal';
import { useDispatch } from 'react-redux';
import { setCurrentUserCredentialsToStore } from '../../redux/slices/chatReducer';

const Header = ({ currentUser }) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const { _id, name, email, pic } = currentUser;

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

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        p="5px 10px"
      >
        <Tooltip
          label="Search Users or Groups"
          hasArrow
          placement="right"
          bg="#0090f9"
          color="white"
          height="2rem"
        >
          <Button variant="ghost">
            <BsSearch />
            <Text
              fontWeight="thin"
              pl="4"
              display={{ base: 'none', md: 'flex' }}
            >
              Search
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="cursive">
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
              <FaBell fontSize="1.3rem" />
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
    </>
  );
};

export default Header;
