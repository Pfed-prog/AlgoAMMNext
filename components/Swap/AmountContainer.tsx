import { Group, NumberInput, Paper, Select } from '@mantine/core';

import { AmountContainerProps } from '@/store/types';

const SwapAmountContainer = ({ option0, option1, amount, setAmount }: AmountContainerProps) => {
  return (
    <Paper radius="xl" shadow="md" withBorder py={10}>
      <Group position="apart" spacing="xs">
        <NumberInput
          min={0}
          defaultValue={0}
          precision={6}
          value={amount}
          onChange={(e) => setAmount(e)}
          size="xl"
          variant="unstyled"
          pl={10}
        />
        <Select
          data={[option0, option1]}
          label=""
          placeholder={'Select a Token'}
          radius="xl"
          mx="lg"
        />
      </Group>
    </Paper>
  );
};

export default SwapAmountContainer;
