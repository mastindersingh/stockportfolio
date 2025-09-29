import type { FC } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Tag,
  Stack,
  Badge
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { StockHolding } from '../types';

const HoldingCard: FC<{ holding: StockHolding }> = ({ holding }) => (
  <Box bg="white" borderRadius="lg" shadow="sm" p={4} display="flex" flexDirection="column" gap={4}>
    <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }}>
      <Stack spacing={1}>
        <Heading size="md">
          {holding.ticker}
          {holding.longName ? <Text as="span"> · {holding.longName}</Text> : null}
        </Heading>
        <Text fontSize="sm" color="gray.500">
          {holding.sector ?? 'Unknown sector'}
        </Text>
        <Flex gap={2} wrap="wrap">
          <Tag colorScheme={holding.performance === 'Up' ? 'green' : 'red'}>{holding.performance}</Tag>
          <Tag>{holding.percentageChange?.toFixed(2)}%</Tag>
          <Tag>Qty: {holding.totalQuantity}</Tag>
        </Flex>
      </Stack>
      <Stack spacing={0} align={{ base: 'flex-start', md: 'flex-end' }}>
        <Text fontSize="lg" fontWeight="bold">
          ${holding.currentPrice?.toFixed(2)}
        </Text>
        <Badge colorScheme="purple">Avg ${holding.weightedAvgPrice?.toFixed(2)}</Badge>
        <Badge colorScheme="blue">Invested ${holding.invested?.toFixed(2)}</Badge>
      </Stack>
    </Flex>
    <Box h={200} w="100%">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={holding.history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" hide minTickGap={12} />
          <YAxis domain={['auto', 'auto']} width={60} />
          <Tooltip />
          <Line type="monotone" dataKey="close" stroke="#3182ce" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

export default HoldingCard;
