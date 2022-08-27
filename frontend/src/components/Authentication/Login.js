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

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all details !',
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
        '/api/user/login',
        { email, password },
        config,
      );

      toast({
        title: 'Login successful !',
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
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Set Your Password"
            type={showPassword ? 'text' : 'password'}
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
          <InputRightElement>
            <Button
              h="1.5rem"
              size="lg"
              marginRight="25px"
              fontSize="x-small"
              color="black"
              onClick={() => handlePasswordVisibility()}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        onClick={submitHandler}
        fontWeight="thin"
        style={{ marginTop: '20px' }}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        variant="solid"
        width="100%"
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
        fontWeight="thin"
        style={{ marginTop: '20px' }}
      >
        Login as a Guest User
      </Button>
    </VStack>
  );
};

export default Login;
