import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { appConfig } from './app-config';

export const config = createConfig({
  chains: [base],
  connectors: [coinbaseWallet({ appName: appConfig.appName }), injected()],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});
