import { Box, HStack, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { ImEye } from 'react-icons/im';
import ProfileModal from './ProfileModal';

// delete feature to be implemented,

// user profile modal shall be visible for selected user
const UserBadgeItem = ({
  user,
  handleDelete,
  currentUser = {},
  selectedChat,
}) => {
  return (
    <HStack
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      display="flex"
      alignItems="center"
      background="#2F6690"
      color="white"
    >
      <Box>
        {user.name === currentUser.name
          ? user.name === selectedChat?.groupAdmin?.name
            ? `${user.name} (You) - Admin`
            : `${user.name} (You)`
          : user.name === selectedChat?.groupAdmin?.name
          ? `${user.name} - Admin`
          : `${user.name}`}
      </Box>
      <ProfileModal currentUser={user}>
        <Tooltip label="View user Profile" hasArrow placement="bottom" my={4}>
          <Box cursor="pointer">
            <ImEye />
          </Box>
        </Tooltip>
      </ProfileModal>
      <Tooltip label="Remove user" hasArrow placement="bottom" my={4}>
        <Box onClick={handleDelete} cursor="pointer">
          <AiFillDelete />
        </Box>
      </Tooltip>
    </HStack>
  );
};

export default UserBadgeItem;
