import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import type { PortfolioSummary } from '../types';

const SummaryStat = ({ label, value, help }: { label: string; value: string; help?: string }) => (
  <Stat bg="white" borderRadius="lg" shadow="sm" p={4}>
    <StatLabel fontWeight="bold">{label}</StatLabel>
    <StatNumber>{value}</StatNumber>
    {help ? <StatHelpText>{help}</StatHelpText> : null}
  </Stat>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);

const PortfolioSummaryCards = ({ summary }: { summary: PortfolioSummary }) => (
  <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} mb={8}>
    <SummaryStat label="Invested" value={formatCurrency(summary.totalInvested)} />
    <SummaryStat label="Current Value" value={formatCurrency(summary.totalCurrentValue)} />
    <SummaryStat
      label="Total Return"
      value={formatCurrency(summary.totalReturn)}
      help={`${summary.percentageUp.toFixed(2)}%`}
    />
    <SummaryStat label="Performance" value={`${summary.percentageUp.toFixed(2)}%`} />
  </SimpleGrid>
);

export default PortfolioSummaryCards;
