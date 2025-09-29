import type { FC, ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Button,
  Text
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'My Portfolio', to: '/portfolio/me' },
  { label: 'Master Portfolio', to: '/portfolio/master' },
  { label: 'USA Portfolio', to: '/portfolio/usa' },
  { label: 'Lessons', to: '/lessons' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' }
];

type NavLinkButtonProps = {
  to: string;
  children: ReactNode;
};

const NavLinkButton: FC<NavLinkButtonProps> = ({ to, children }) => (
  <Button
    as={NavLink}
    to={to}
    variant="ghost"
    fontWeight="semibold"
    _activeLink={{ color: 'blue.500' }}
    _hover={{ bg: 'blue.50' }}
    px={3}
  >
    {children}
  </Button>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box bg="white" shadow="sm" position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto" px={4}>
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={4} alignItems="center">
          <Text fontWeight="bold" fontSize="lg" color="blue.500">
            StockLive
          </Text>
          <HStack as="nav" spacing={2} display={{ base: 'none', md: 'flex' }}>
            {links.map((link) => (
              <NavLinkButton key={link.to} to={link.to}>
                {link.label}
              </NavLinkButton>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems="center" gap={3}>
          {isAuthenticated && user?.email && (
            <Text fontSize="sm" color="gray.600" display={{ base: 'none', md: 'block' }}>
              {user.email}
            </Text>
          )}
          {isAuthenticated ? (
            <Button colorScheme="blue" variant="solid" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button as={NavLink} to="/login" colorScheme="blue" variant="outline">
              Login
            </Button>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={2} px={4}>
            {links.map((link) => (
              <NavLinkButton key={link.to} to={link.to}>
                {link.label}
              </NavLinkButton>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
