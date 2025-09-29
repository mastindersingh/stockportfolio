import { useMemo } from 'react';
import { SimpleGrid, Heading, Stack, Text, Alert, AlertIcon, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { usePortfolio } from '../hooks/usePortfolio';
import { fetchRecommendations } from '../api/portfolio';
import HoldingCard from '../components/HoldingCard';
import PortfolioSummaryCards from '../components/PortfolioSummary';
import type { StockRecommendation } from '../types';

const Dashboard = () => {
  const {
    data: myPortfolio,
    isLoading: isMyPortfolioLoading,
    error: myPortfolioError
  } = usePortfolio('me');

  const {
    data: masterPortfolio,
    isLoading: isMasterLoading,
    error: masterError
  } = usePortfolio('master');

  const {
    data: recommendations,
    isLoading: recommendationsLoading
  } = useQuery<StockRecommendation[]>({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations
  });

  const masterSummary = useMemo(() => masterPortfolio?.summary, [masterPortfolio]);

  return (
    <Stack spacing={10}>
      <Stack spacing={3}>
        <Heading size="lg">Welcome back</Heading>
        <Text color="gray.600">Track your portfolio performance and explore fresh ideas.</Text>
      </Stack>

      {myPortfolioError ? (
        <Alert status="warning">
          <AlertIcon />
          We were unable to load your portfolio. {myPortfolioError.message}
        </Alert>
      ) : null}

      {isMyPortfolioLoading ? (
        <Skeleton height="200px" borderRadius="lg" />
      ) : myPortfolio ? (
        <>
          <PortfolioSummaryCards summary={myPortfolio.summary} />
          <Heading size="md">Your Holdings</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {myPortfolio.holdings.map((holding) => (
              <HoldingCard key={holding.ticker} holding={holding} />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Alert status="info">
          <AlertIcon />
          No holdings available yet. Add stocks to see them here.
        </Alert>
      )}

      {masterError ? (
        <Alert status="info">
          <AlertIcon />
          Master portfolio is available for subscribers only.
        </Alert>
      ) : (
        <Stack spacing={4}>
          <Heading size="md">Master Portfolio Highlights</Heading>
          {isMasterLoading ? (
            <Skeleton height="160px" borderRadius="lg" />
          ) : masterSummary ? (
            <PortfolioSummaryCards summary={masterSummary} />
          ) : null}
        </Stack>
      )}

      <Stack spacing={4}>
        <Heading size="md">Stock Recommendations</Heading>
        {recommendationsLoading ? (
          <Skeleton height="160px" borderRadius="lg" />
        ) : recommendations?.length ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {recommendations.map((idea) => (
              <Stack key={idea.name} bg="white" borderRadius="lg" shadow="sm" p={4} spacing={1}>
                <Heading size="sm">{idea.name}</Heading>
                <Text fontWeight="medium">${idea.price.toFixed(2)}</Text>
                <Text color="gray.600">Signal: {idea.recommendation}</Text>
              </Stack>
            ))}
          </SimpleGrid>
        ) : (
          <Text color="gray.600">No active recommendations right now.</Text>
        )}
      </Stack>
    </Stack>
  );
};

export default Dashboard;
