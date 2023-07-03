import '@/styles/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LayoutApp from '@/components/Layout';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [queryClient] = useState(() => new QueryClient());
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  return (
    <MantineProvider theme={{ colorScheme }}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState} />

        <Head>
          <title>Algo AMM</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="shortcut icon" href="/logo.svg" />
        </Head>

        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <LayoutApp>
            <Component {...pageProps} />
          </LayoutApp>
          <Notifications />
        </ColorSchemeProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
