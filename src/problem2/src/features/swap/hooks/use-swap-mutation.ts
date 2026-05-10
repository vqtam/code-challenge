import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tokenQueryKeys } from '../constants';
import { TokenService } from '../services/token-service';

export function useSwapMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TokenService.swap,
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: tokenQueryKeys.list() });
    },
  });
}
