import { useParams } from 'react-router-dom';
import { Heading, Stack, Text, SimpleGrid, Alert, AlertIcon, Skeleton } from '@chakra-ui/react';
import HoldingCard from '../components/HoldingCard';
import PortfolioSummaryCards from '../components/PortfolioSummary';
import { usePortfolio } from '../hooks/usePortfolio';

const Portfolio = () => {
  const { variant = 'me' } = useParams<{ variant: 'master' | 'usa' | 'me' }>();
  const {
    data: portfolio,
    isLoading,
    error
  } = usePortfolio(variant);

  const titleMap: Record<string, string> = {
    me: 'My Portfolio',
    master: 'Master Portfolio',
    usa: 'USA Portfolio'
  };

  return (
    <Stack spacing={6}>
      <Heading size="lg">{titleMap[variant] ?? 'Portfolio'}</Heading>
      {error ? (
        <Alert status="error">
          <AlertIcon />
          {error.message}
        </Alert>
      ) : null}

      {isLoading ? (
        <Skeleton height="200px" borderRadius="lg" />
      ) : portfolio ? (
        <>
          <PortfolioSummaryCards summary={portfolio.summary} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {portfolio.holdings.map((holding) => (
              <HoldingCard key={holding.ticker} holding={holding} />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Text color="gray.600">No holdings found for this portfolio.</Text>
      )}
    </Stack>
  );
};

export default Portfolio;
