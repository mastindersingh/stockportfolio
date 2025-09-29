import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => (
  <Box textAlign="center" py={10}>
    <Heading size="2xl" mb={4}>
      404
    </Heading>
    <Text fontSize="lg" mb={6}>
      Oops, the page you are looking for does not exist.
    </Text>
    <Button as={RouterLink} to="/" colorScheme="blue">
      Back to dashboard
    </Button>
  </Box>
);

export default NotFound;
