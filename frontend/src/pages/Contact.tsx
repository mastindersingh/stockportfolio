import { useState, type FormEvent } from 'react';
import {
  Heading,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { submitContact } from '../api/content';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setError(null);

    try {
      await submitContact({ name, email, message });
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError((err as Error).message ?? 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={6} as="form" onSubmit={handleSubmit} maxW="lg">
      <Heading size="lg">Contact us</Heading>
      <Text color="gray.600">Have a question? Send us a message and we will get back to you within 24 hours.</Text>
      {status === 'success' ? (
        <Alert status="success">
          <AlertIcon />
          Message sent successfully.
        </Alert>
      ) : null}
      {status === 'error' && error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : null}
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Message</FormLabel>
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="How can we help you?"
          minH="150px"
        />
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={isSubmitting} alignSelf="flex-start">
        Send message
      </Button>
    </Stack>
  );
};

export default Contact;
