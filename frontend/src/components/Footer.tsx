import { Box, Text, Stack, Link, HStack } from '@chakra-ui/react';

const Footer = () => (
  <Box bg="gray.900" color="gray.100" py={6} mt={8}>
    <Stack maxW="container.xl" mx="auto" spacing={4} px={4}>
      <HStack spacing={4} wrap="wrap">
        <Link href="/" _hover={{ textDecoration: 'underline' }}>
          Home
        </Link>
        <Link href="/lessons" _hover={{ textDecoration: 'underline' }}>
          Lessons
        </Link>
        <Link href="/blog" _hover={{ textDecoration: 'underline' }}>
          Blog
        </Link>
        <Link href="/contact" _hover={{ textDecoration: 'underline' }}>
          Contact
        </Link>
      </HStack>
      <Text fontSize="sm">© {new Date().getFullYear()} StockLive. All rights reserved.</Text>
    </Stack>
  </Box>
);

export default Footer;
