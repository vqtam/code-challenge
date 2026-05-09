import { MantineProvider } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { Notifications } from '@mantine/notifications';
import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { createQueryClient } from '@/config';
import { NOTIFICATIONS_Z_INDEX } from '@/constants';

import { theme } from './theme';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark" stylesTransform={emotionTransform} theme={theme}>
        <MantineEmotionProvider>
          <Notifications position="top-right" zIndex={NOTIFICATIONS_Z_INDEX} />
          {children}
        </MantineEmotionProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
