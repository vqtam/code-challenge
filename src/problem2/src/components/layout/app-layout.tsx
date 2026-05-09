import { AppShell, Container, Group, Text, ThemeIcon } from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { ColorSchemeToggle } from '@/components/color-scheme-toggle/color-scheme-toggle';
import { APP_HEADER_HEIGHT, APP_NAME } from '@/constants';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppShell header={{ height: APP_HEADER_HEIGHT }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Group gap="sm">
              <ThemeIcon size="lg" variant="light">
                <IconBolt size={20} stroke={2.2} />
              </ThemeIcon>
              <Text fw={700} size="lg">
                {APP_NAME}
              </Text>
            </Group>

            <ColorSchemeToggle />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
