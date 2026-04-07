import { type Address } from 'viem';

export const appConfig: {
  appId: string;
  appName: string;
  description: string;
  contractAddress: Address;
  builderCode?: string;
  encodedString?: string;
  baseAppMeta?: string;
  verificationMeta?: string;
} = {
  appId: '184',
  appName: 'SimpleWallet',
  description:
    'A beginner-friendly wallet tool on Base for depositing ETH into a simple contract and withdrawing only your own balance.',
  contractAddress: '0x4CFBEE11a85d943E88B1F037162DA65c77DaDf4F',
  builderCode: undefined,
  encodedString: undefined,
  baseAppMeta: undefined,
  verificationMeta: undefined,
};
