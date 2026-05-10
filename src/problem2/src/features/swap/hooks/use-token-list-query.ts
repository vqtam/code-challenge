import { useQuery } from '@tanstack/react-query';

import { TOKEN_LIST_STALE_TIME_MS, tokenQueryKeys } from '../constants';
import { TokenService } from '../services/token-service';

export function useTokenListQuery() {
  return useQuery({
    queryKey: tokenQueryKeys.list(),
    queryFn: TokenService.getList,
    staleTime: TOKEN_LIST_STALE_TIME_MS,
  });
}
