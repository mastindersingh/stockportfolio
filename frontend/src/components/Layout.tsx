import { Outlet } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => (
  <Box minH="100vh" display="flex" flexDirection="column">
    <Navbar />
    <Container maxW="container.xl" flex="1" py={8}>
      <Outlet />
    </Container>
    <Footer />
  </Box>
);

export default Layout;
