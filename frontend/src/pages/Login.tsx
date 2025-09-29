import { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Stack,
  Text,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerRequest } from '../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await registerRequest({ email, password });
      }
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message ?? 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" px={4}>
      <Box bg="white" p={8} borderRadius="lg" shadow="md" maxW="md" w="full">
        <Stack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading size="lg" textAlign="center">
            {isRegisterMode ? 'Create an account' : 'Sign in to continue'}
          </Heading>
          {error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : null}
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            {isRegisterMode ? 'Register and Sign In' : 'Sign In'}
          </Button>
          <Text fontSize="sm" textAlign="center" color="gray.600">
            {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
            <RouterLink to="#" onClick={() => setIsRegisterMode((prev) => !prev)}>
              {isRegisterMode ? 'Sign in' : 'Create one'}
            </RouterLink>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
