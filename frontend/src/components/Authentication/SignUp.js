import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePasswordVisibility = (params) => {
    switch (params) {
      case 'PASSWORD':
        setShowPassword(!showPassword);
        break;
      case 'CONFIRM PASSWORD':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const profilePictureHandler = (params) => {
    setLoading(true);

    if (params === undefined) {
      setLoading(false);
      return;
    }

    if (
      params.type === 'image/jpeg' ||
      params.type === 'image/png' ||
      params.type === 'image/jpg'
    ) {
      const data = new FormData();
      data.append('file', params);
      data.append('upload_preset', 'MERN-CHAT-APP');
      data.append('cloud_name', 'dmol8f0ij');
      fetch('https://api.cloudinary.com/v1_1/dmol8f0ij/image/upload', {
        method: 'post',
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          toast({
            title: 'Profile picture uploaded successfully !',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong !',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
          return;
        });
    } else {
      toast({
        title: 'Only add JPEG/JPG/PNG images!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please Fill add the fields..',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords not matching !!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user/sign-up',
        { name, email, password, pic },
        config,
      );
      toast({
        title: 'Signed up successfully !',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      localStorage.setItem('User-Info', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Something went wrong !',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(event) => setName(event.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Set Your Password"
            type={showPassword ? 'text' : 'password'}
            onChange={(event) => setPassword(event.target.value)}
          />
          <InputRightElement>
            <Button
              h="1.5rem"
              size="lg"
              marginRight="25px"
              fontSize="x-small"
              color="black"
              onClick={() => handlePasswordVisibility('PASSWORD')}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Confirm Your Password"
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <InputRightElement>
            <Button
              h="1.5rem"
              size="lg"
              marginRight="25px"
              fontSize="x-small"
              color="black"
              onClick={() => handlePasswordVisibility('CONFIRM PASSWORD')}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          lineHeight="shorter"
          p={1.5}
          accept="image/*"
          onChange={(event) => profilePictureHandler(event.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        onClick={submitHandler}
        fontWeight="thin"
        style={{ marginTop: '20px' }}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
