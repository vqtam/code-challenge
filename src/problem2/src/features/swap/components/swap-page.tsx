import { SwapForm } from './swap-form';
import { Container, Center } from '@mantine/core';

export function SwapPage() {
  return (
    <Container px={0} pt={{ base: 'md', sm: 'xl' }}>
      <Center>
        <SwapForm />
      </Center>
    </Container>
  );
}
