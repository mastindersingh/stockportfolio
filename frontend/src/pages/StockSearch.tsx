import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaSearch, FaChartLine, FaBuilding, FaGlobe, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  high52Week: number;
  low52Week: number;
  sector: string;
  industry: string;
  description: string;
  website: string;
  employees: number;
  founded: string;
  headquarters: string;
}

const StockSearch: React.FC = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSearch = async () => {
    if (!searchSymbol.trim()) return;

    setIsLoading(true);
    setError(null);
    setStockData(null);

    try {
      const response = await fetch(`/api/stock-search?symbol=${encodeURIComponent(searchSymbol.toUpperCase())}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to fetch stock data. Please check the symbol and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" color="blue.500" mb={2}>
            🔍 Stock Search & Analysis
          </Heading>
          <Text color="gray.600">
            Get comprehensive information about any stock symbol
          </Text>
        </Box>

        {/* Search Bar */}
        <Card>
          <CardBody>
            <HStack spacing={4}>
              <Input
                placeholder="Enter stock symbol (e.g., TCS.NS, RELIANCE.NS, INFY.NS)"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                size="lg"
                bg={bgColor}
                border="2px"
                borderColor={borderColor}
                _focus={{ borderColor: 'blue.500' }}
              />
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSearch}
                disabled={!searchSymbol.trim() || isLoading}
                leftIcon={<FaSearch />}
                minW="120px"
              >
                {isLoading ? <Spinner size="sm" /> : 'Search'}
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Stock Data Display */}
        {stockData && (
          <VStack spacing={6} align="stretch">
            {/* Header Information */}
            <Card>
              <CardHeader>
                <HStack justify="space-between" wrap="wrap">
                  <VStack align="start" spacing={1}>
                    <Heading size="lg">{stockData.name}</Heading>
                    <Text fontSize="lg" color="gray.600">{stockData.symbol}</Text>
                    <HStack>
                      <Badge colorScheme="blue">{stockData.sector}</Badge>
                      <Badge colorScheme="green">{stockData.industry}</Badge>
                    </HStack>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Text fontSize="3xl" fontWeight="bold">
                      {formatCurrency(stockData.currentPrice)}
                    </Text>
                    <HStack>
                      <Text
                        fontSize="lg"
                        color={stockData.change >= 0 ? 'green.500' : 'red.500'}
                        fontWeight="semibold"
                      >
                        {stockData.change >= 0 ? '+' : ''}
                        {formatCurrency(stockData.change)}
                      </Text>
                      <Badge
                        colorScheme={stockData.changePercent >= 0 ? 'green' : 'red'}
                        fontSize="md"
                      >
                        {stockData.changePercent >= 0 ? '+' : ''}
                        {stockData.changePercent.toFixed(2)}%
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </CardHeader>
            </Card>

            {/* Detailed Information Tabs */}
            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab><Icon as={FaChartLine} mr={2} />Key Metrics</Tab>
                <Tab><Icon as={FaBuilding} mr={2} />Company Info</Tab>
                <Tab><Icon as={FaMoneyBillWave} mr={2} />Financial Data</Tab>
              </TabList>

              <TabPanels>
                {/* Key Metrics Tab */}
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    <Stat>
                      <StatLabel>Previous Close</StatLabel>
                      <StatNumber>{formatCurrency(stockData.previousClose)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Volume</StatLabel>
                      <StatNumber>{formatNumber(stockData.volume)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Market Cap</StatLabel>
                      <StatNumber>{formatCurrency(stockData.marketCap)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>52 Week High</StatLabel>
                      <StatNumber>{formatCurrency(stockData.high52Week)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>52 Week Low</StatLabel>
                      <StatNumber>{formatCurrency(stockData.low52Week)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>P/E Ratio</StatLabel>
                      <StatNumber>{stockData.peRatio ? stockData.peRatio.toFixed(2) : 'N/A'}</StatNumber>
                    </Stat>
                  </SimpleGrid>
                </TabPanel>

                {/* Company Info Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontWeight="bold" fontSize="lg" mb={2}>Company Description</Text>
                      <Text>{stockData.description || 'No description available'}</Text>
                    </Box>
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Icon as={FaGlobe} color="blue.500" />
                          <Text fontWeight="semibold">Website:</Text>
                          <Text 
                            as="a" 
                            href={stockData.website} 
                            target="_blank" 
                            color="blue.500"
                            _hover={{ textDecoration: 'underline' }}
                          >
                            {stockData.website || 'N/A'}
                          </Text>
                        </HStack>
                        
                        <HStack>
                          <Icon as={FaBuilding} color="blue.500" />
                          <Text fontWeight="semibold">Headquarters:</Text>
                          <Text>{stockData.headquarters || 'N/A'}</Text>
                        </HStack>
                      </VStack>
                      
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Icon as={FaUsers} color="blue.500" />
                          <Text fontWeight="semibold">Employees:</Text>
                          <Text>{stockData.employees ? formatNumber(stockData.employees) : 'N/A'}</Text>
                        </HStack>
                        
                        <HStack>
                          <Text fontWeight="semibold">Founded:</Text>
                          <Text>{stockData.founded || 'N/A'}</Text>
                        </HStack>
                      </VStack>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>

                {/* Financial Data Tab */}
                <TabPanel>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Metric</Th>
                        <Th isNumeric>Value</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Current Price</Td>
                        <Td isNumeric>{formatCurrency(stockData.currentPrice)}</Td>
                      </Tr>
                      <Tr>
                        <Td>Market Capitalization</Td>
                        <Td isNumeric>{formatCurrency(stockData.marketCap)}</Td>
                      </Tr>
                      <Tr>
                        <Td>Price-to-Earnings Ratio</Td>
                        <Td isNumeric>{stockData.peRatio ? stockData.peRatio.toFixed(2) : 'N/A'}</Td>
                      </Tr>
                      <Tr>
                        <Td>Dividend Yield</Td>
                        <Td isNumeric>{stockData.dividendYield ? `${stockData.dividendYield.toFixed(2)}%` : 'N/A'}</Td>
                      </Tr>
                      <Tr>
                        <Td>Trading Volume</Td>
                        <Td isNumeric>{formatNumber(stockData.volume)}</Td>
                      </Tr>
                      <Tr>
                        <Td>52-Week Range</Td>
                        <Td isNumeric>
                          {formatCurrency(stockData.low52Week)} - {formatCurrency(stockData.high52Week)}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        )}

        {/* Popular Stocks Quick Search */}
        <Card>
          <CardHeader>
            <Heading size="md">Popular Indian Stocks</Heading>
          </CardHeader>
          <CardBody>
            <Flex wrap="wrap" gap={2}>
              {['TCS.NS', 'RELIANCE.NS', 'INFY.NS', 'HDFCBANK.NS', 'ICICIBANK.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'HINDUNILVR.NS', 'LT.NS'].map((symbol) => (
                <Button
                  key={symbol}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchSymbol(symbol);
                    setIsLoading(true);
                    setError(null);
                    setStockData(null);
                    // Trigger search
                    setTimeout(() => handleSearch(), 100);
                  }}
                >
                  {symbol.replace('.NS', '')}
                </Button>
              ))}
            </Flex>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default StockSearch;