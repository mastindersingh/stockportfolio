import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  Flex,
  Container,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI stock portfolio assistant. I can help you analyze your stocks, explain market trends, and answer questions about your investments. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const messageBgUser = useColorModeValue('blue.500', 'blue.600');
  const messageBgAI = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get AI response. Please try again.');
      
      // Add a fallback AI response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting to the AI service right now. Please try again in a moment, or feel free to ask me about your portfolio, stock analysis, or investment strategies.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={4} align="stretch" h="80vh">
        <Box textAlign="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            🤖 AI Stock Assistant
          </Text>
          <Text fontSize="md" color="gray.600">
            Get insights about your portfolio and market analysis
          </Text>
        </Box>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box
          flex="1"
          bg={bgColor}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          p={4}
          overflowY="auto"
        >
          <VStack spacing={4} align="stretch">
            {messages.map((message) => (
              <HStack
                key={message.id}
                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                align="flex-start"
              >
                {message.sender === 'ai' && (
                  <Avatar
                    size="sm"
                    bg="blue.500"
                    icon={<FaRobot />}
                    color="white"
                  />
                )}
                
                <Box
                  maxW="70%"
                  bg={message.sender === 'user' ? messageBgUser : messageBgAI}
                  color={message.sender === 'user' ? 'white' : 'inherit'}
                  p={3}
                  borderRadius="lg"
                  shadow="sm"
                >
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {message.content}
                  </Text>
                  <Text
                    fontSize="xs"
                    color={message.sender === 'user' ? 'blue.100' : 'gray.500'}
                    mt={1}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </Box>

                {message.sender === 'user' && (
                  <Avatar
                    size="sm"
                    bg="gray.500"
                    icon={<FaUser />}
                    color="white"
                  />
                )}
              </HStack>
            ))}
            
            {isLoading && (
              <HStack justify="flex-start" align="flex-start">
                <Avatar
                  size="sm"
                  bg="blue.500"
                  icon={<FaRobot />}
                  color="white"
                />
                <Box
                  bg={messageBgAI}
                  p={3}
                  borderRadius="lg"
                  shadow="sm"
                >
                  <HStack>
                    <Spinner size="sm" />
                    <Text fontSize="sm" color="gray.600">
                      AI is thinking...
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            )}
            
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <HStack>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your stocks, market trends, or investment advice..."
            bg="white"
            border="1px"
            borderColor={borderColor}
            _focus={{ borderColor: 'blue.500' }}
            disabled={isLoading}
          />
          <Button
            colorScheme="blue"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            leftIcon={<FaPaperPlane />}
          >
            Send
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Chat;