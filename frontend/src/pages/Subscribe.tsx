import { useState, type FormEvent } from 'react';
import { Stack, Heading, Text, FormControl, FormLabel, Input, Button, Alert, AlertIcon } from '@chakra-ui/react';
import { updateSubscription } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Subscribe = () => {
  const { user, refresh } = useAuth();
  const [code, setCode] = useState(user?.subscriptionCode ?? '');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setError(null);
    setIsSubmitting(true);

    try {
  await updateSubscription(code);
  await refresh();
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError((err as Error).message ?? 'Unable to update subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={6} as="form" onSubmit={handleSubmit} maxW="lg">
      <Heading size="lg">Subscription</Heading>
      <Text color="gray.600">
        Enter your subscription code to unlock premium portfolios and exclusive research content.
      </Text>
      {status === 'success' ? (
        <Alert status="success">
          <AlertIcon />
          Subscription updated successfully.
        </Alert>
      ) : null}
      {status === 'error' && error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : null}
      <FormControl isRequired>
        <FormLabel>Subscription code</FormLabel>
        <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter your code" />
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={isSubmitting} alignSelf="flex-start">
        Save code
      </Button>
    </Stack>
  );
};

export default Subscribe;
