import Tokens, {
  TokensPageProps
} from 'pages/dao/[dao]/treasury/tokens/TokensPage';
import { SputnikService } from 'services/SputnikService';
import { Token } from 'types/token';
import { getChartData } from 'features/treasury/helpers';
import { fetchNearPrice } from 'hooks/useNearPrice';

interface GetTokensQuery {
  dao: string;
  offset?: number;
  limit?: number;
}

export const getServerSideProps = async ({
  query
}: {
  query: GetTokensQuery;
}): Promise<{
  props: TokensPageProps;
}> => {
  const tokens = await SputnikService.getTokens(query);
  const dao = await SputnikService.getDaoById(query.dao);
  const transactions = await SputnikService.getTransfers(query.dao);
  const price = await fetchNearPrice();

  const totalTokensValue = tokens.reduce(
    (res, item) => res + Number(item.totalSupply),
    Number(dao?.funds) ?? 0
  );

  return {
    props: {
      data: {
        chartData: getChartData(transactions, price),
        tokens: [
          {
            tokenId: 'NEAR',
            totalSupply: dao?.funds ?? '0',
            icon: 'near',
            symbol: 'near'
          } as Token,
          ...tokens
        ],
        totalValue: dao?.funds ?? '0',
        totalTokensValue
      }
    }
  };
};

export default Tokens;
