import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  const isDark = computedColorScheme === 'dark';

  return (
    <Tooltip label={isDark ? 'Use light mode' : 'Use dark mode'}>
      <ActionIcon
        aria-label={isDark ? 'Use light mode' : 'Use dark mode'}
        size="lg"
        sx={(_theme, u) => ({
          [u.smallerThan('sm')]: {
            height: 40,
            minWidth: 40,
            width: 40,
          },
        })}
        variant="light"
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
      >
        {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}
