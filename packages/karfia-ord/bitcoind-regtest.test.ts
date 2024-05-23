import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { KarfiaContainer, KarfiaTestcontainers } from 'karfia-testcontainers';

import definition from './bitcoind-regtest.json';

let testcontainers: KarfiaTestcontainers;

beforeAll(async () => {
  testcontainers = await KarfiaTestcontainers.start(definition);
});

afterAll(async () => {
  await testcontainers.stop();
});

describe('bitcoind', () => {
  let bitcoind: KarfiaContainer;

  beforeAll(() => {
    bitcoind = testcontainers.getContainer('bitcoind');
  });

  it('should rpc getblockchaininfo', async () => {
    const response = await bitcoind.rpc({
      method: 'getblockchaininfo',
    });

    expect(response.status).toStrictEqual(200);

    expect(await response.json()).toMatchObject({
      result: {
        bestblockhash: '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206',
        chain: 'regtest',
        blocks: 0,
      },
    });
  });
});

describe('ord', () => {
  let ord: KarfiaContainer;

  beforeAll(() => {
    ord = testcontainers.getContainer('ord');
  });

  it('should get', async () => {
    const response = await ord.fetch({
      endpoint: 'api',
      method: 'GET',
      path: '/status',
    });

    console.log(await response.json());
  });
});
