import React from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ImEye } from 'react-icons/im';

const ProfileModal = ({ currentUser, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { _id, name, email, pic } = currentUser;

  return (
    <>
      {children ? (
        <div onClick={onOpen}>{children}</div>
      ) : (
        <IconButton
          display={{ base: 'flex' }}
          icon={<ImEye />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent height="400px">
          <ModalHeader fontSize="2xl" display="flex" justifyContent="center">
            Profile Info
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              my="2.5"
              flexDirection="column"
            >
              <Box>
                <Image
                  src={pic}
                  alt={name}
                  height="12.5rem"
                  width="12.5rem"
                  borderRadius="50%"
                />
              </Box>
              <Box
                height="50px"
                my="2"
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
              >
                <Box my="2">
                  <Text fontSize="large" fontWeight="medium">
                    {name}
                  </Text>
                </Box>
                <Divider />
                <Box my="2">
                  <Text fontSize="large" fontWeight="medium">
                    {email}
                  </Text>
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
