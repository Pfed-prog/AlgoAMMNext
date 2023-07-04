import { Paper, Text, Box, Image, Center } from '@mantine/core';
import Link from 'next/link';

import { AMMs } from 'contracts';

const PoolsPage = () => {
  return (
    <Box
      mx="auto"
      sx={{
        gap: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 5fr))',
        gridTemplateRows: 'masonry',
      }}
    >
      {Object.entries(AMMs).map(([index, item]) => {
        return (
          <Paper
            component={Link}
            withBorder
            radius="lg"
            shadow="md"
            p="md"
            sx={{ cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
            key={index}
            href={`/market/${item.appId}`}
          >
            <Center>
              <Image width={270} height={200} src={item.image} />
            </Center>
            <Text align="center" mt="sm" lineClamp={1} size="xl" variant="link" component="a">
              {item.question}
            </Text>
          </Paper>
        );
      })}
    </Box>
  );
};

export default PoolsPage;
