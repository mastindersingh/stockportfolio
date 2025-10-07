import { Box, Text, Stack, Link, HStack, VStack, Divider, SimpleGrid } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';

const Footer = () => (
  <Box bg="gray.900" color="gray.100" py={8} mt={8}>
    <Stack maxW="container.xl" mx="auto" spacing={6} px={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {/* Navigation Links */}
        <VStack align="start" spacing={3}>
          <Text fontWeight="bold" fontSize="lg" color="blue.300">
            Quick Links
          </Text>
          <VStack align="start" spacing={2}>
            <Link href="/" _hover={{ color: 'blue.300' }}>
              Dashboard
            </Link>
            <Link href="/portfolio/me" _hover={{ color: 'blue.300' }}>
              My Portfolio
            </Link>
            <Link href="/lessons" _hover={{ color: 'blue.300' }}>
              Lessons
            </Link>
            <Link href="/chat" _hover={{ color: 'blue.300' }}>
              AI Chat
            </Link>
            <Link href="/blog" _hover={{ color: 'blue.300' }}>
              Blog
            </Link>
            <Link href="/contact" _hover={{ color: 'blue.300' }}>
              Contact
            </Link>
          </VStack>
        </VStack>

        {/* Social Media Links */}
        <VStack align="start" spacing={3}>
          <Text fontWeight="bold" fontSize="lg" color="blue.300">
            Follow Us
          </Text>
          <HStack spacing={4}>
            <Link 
              href="https://facebook.com/stocklive" 
              isExternal 
              _hover={{ color: 'blue.400' }}
              title="Facebook"
            >
              <FaFacebook size="24px" />
            </Link>
            <Link 
              href="https://twitter.com/stocklive" 
              isExternal 
              _hover={{ color: 'blue.400' }}
              title="Twitter"
            >
              <FaTwitter size="24px" />
            </Link>
            <Link 
              href="https://linkedin.com/company/stocklive" 
              isExternal 
              _hover={{ color: 'blue.400' }}
              title="LinkedIn"
            >
              <FaLinkedin size="24px" />
            </Link>
            <Link 
              href="https://instagram.com/stocklive" 
              isExternal 
              _hover={{ color: 'blue.400' }}
              title="Instagram"
            >
              <FaInstagram size="24px" />
            </Link>
            <Link 
              href="https://youtube.com/stocklive" 
              isExternal 
              _hover={{ color: 'blue.400' }}
              title="YouTube"
            >
              <FaYoutube size="24px" />
            </Link>
            <Link 
              href="https://github.com/mastindersingh/stockportfolio" 
              isExternal 
              _hover={{ color: 'blue.400' }}
              title="GitHub"
            >
              <FaGithub size="24px" />
            </Link>
          </HStack>
        </VStack>

        {/* Contact Info */}
        <VStack align="start" spacing={3}>
          <Text fontWeight="bold" fontSize="lg" color="blue.300">
            Contact Info
          </Text>
          <VStack align="start" spacing={1} fontSize="sm">
            <Text>📧 support@stocklive.com</Text>
            <Text>📞 +91 98765 43210</Text>
            <Text>🏢 Mumbai, Maharashtra, India</Text>
            <Text>⏰ Mon-Fri: 9:00 AM - 6:00 PM IST</Text>
          </VStack>
        </VStack>
      </SimpleGrid>

      <Divider borderColor="gray.600" />
      
      <HStack justify="space-between" wrap="wrap">
        <Text fontSize="sm">
          © {new Date().getFullYear()} StockLive. All rights reserved.
        </Text>
        <HStack spacing={4} fontSize="sm">
          <Link href="/privacy" _hover={{ color: 'blue.300' }}>
            Privacy Policy
          </Link>
          <Link href="/terms" _hover={{ color: 'blue.300' }}>
            Terms of Service
          </Link>
          <Link href="/disclaimer" _hover={{ color: 'blue.300' }}>
            Disclaimer
          </Link>
        </HStack>
      </HStack>
    </Stack>
  </Box>
);

export default Footer;
