import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

const UserListItem = ({ user, onUserSelect }) => {
  return (
    <Box
      onClick={onUserSelect}
      cursor="pointer"
      bg="#a2d2ff"
      _hover={{ backgroundColor: '#023047', color: 'white' }}
      width="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      my={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>E-mail : </b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
