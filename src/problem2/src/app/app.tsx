import { AppLayout } from '@/components/layout';
import { AppProviders } from './providers';
import { SwapPage } from '@/features/swap/components/swap-page';

export function App() {
  return (
    <AppProviders>
      <AppLayout>
        <SwapPage />
      </AppLayout>
    </AppProviders>
  );
}
