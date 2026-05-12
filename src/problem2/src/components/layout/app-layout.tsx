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
    <AppShell
      header={{ height: { base: 60, sm: APP_HEADER_HEIGHT } }}
      padding={{ base: 'xs', sm: 'md' }}
    >
      <AppShell.Header>
        <Container size="lg" h="100%" px={{ base: 'sm', sm: 'md' }}>
          <Group h="100%" justify="space-between">
            <Group gap="xs">
              <ThemeIcon
                size="lg"
                variant="light"
                sx={(_theme, u) => ({
                  [u.smallerThan('sm')]: {
                    height: 40,
                    minWidth: 40,
                    width: 40,
                  },
                })}
              >
                <IconBolt size={18} stroke={2.2} />
              </ThemeIcon>
              <Text
                fw={700}
                size="lg"
                sx={(theme, u) => ({
                  [u.smallerThan('sm')]: {
                    fontSize: theme.fontSizes.md,
                  },
                })}
              >
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
