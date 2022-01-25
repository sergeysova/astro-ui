import BN from 'bn.js';
import compact from 'lodash/compact';
import { transactions, utils } from 'near-api-js';

import { nearConfig, NearConfig } from 'config';

import {
  GAS_VALUE,
  SputnikNearService,
} from 'services/sputnik/SputnikNearService';

import { jsonToBase64Str } from 'utils/jsonToBase64Str';

const YOKTO_NEAR = '1000000000000000000000000';
const ONE_YOKTO_NEAR = new BN(YOKTO_NEAR);
const MINIMAL_BOND = new BN(YOKTO_NEAR).div(new BN(10));

class SputnikWeightedPoliceServiceClass {
  private readonly config: NearConfig;

  constructor(config: NearConfig) {
    this.config = config;
  }

  // eslint-disable-next-line class-methods-use-this
  private async getBlockHashAndDefaultNonce() {
    const accessKey = await SputnikNearService.getAccessKey();
    const block = await SputnikNearService.getBlock();
    const blockHash = utils.serialize.base_decode(block.header.hash);

    const defaultNonce = accessKey.nonce;

    return {
      defaultNonce,
      blockHash,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private executeTransactions(
    trx: (transactions.Transaction | null) | (transactions.Transaction | null)[]
  ) {
    let trxToExecute = trx;

    if (!Array.isArray(trxToExecute)) {
      trxToExecute = [trxToExecute];
    }

    return SputnikNearService.sendTransactions(compact(trxToExecute));
  }

  private async getCreateDaoTransaction(
    daoName: string,
    nonce: number,
    blockHash: Uint8Array
  ) {
    const council = SputnikNearService.getAccountId();

    const args = jsonToBase64Str({
      config: {
        name: daoName,
        bond: ONE_YOKTO_NEAR.mul(new BN(5)).toString(),
        metadata: '',
        purpose: 'Sputnik V2 DAO',
      },
      policy: [council],
    });

    return SputnikNearService.buildTransaction(
      this.config.contractName,
      nonce,
      [
        transactions.functionCall(
          'create',
          {
            name: daoName,
            args,
          },
          GAS_VALUE,
          ONE_YOKTO_NEAR.mul(new BN(5))
        ),
      ],
      blockHash
    );
  }

  private async getProposalTokenFarmTransaction(
    tokenName: string,
    tokenSymbol: string,
    tokenAmount: number,
    daoId: string,
    nonce: number,
    blockHash: Uint8Array
  ) {
    const yoctoAmount = new BN(tokenAmount).div(new BN(YOKTO_NEAR)).toString();

    const tokenArgs = {
      args: {
        owner_id: daoId,
        total_supply: yoctoAmount,
        metadata: {
          spec: 'ft-1.0.0',
          name: tokenName,
          symbol: tokenSymbol,
          icon: '',
          decimals: 18,
        },
      },
    };

    const tokenArgsInBase64 = jsonToBase64Str(tokenArgs);

    return SputnikNearService.buildTransaction(
      this.config.tokenFactoryContractName,
      nonce,
      [
        transactions.functionCall(
          'add_proposal',
          {
            proposal: {
              description: `Farming ${tokenAmount} units of a new token: ${tokenName} to ${daoId}.`,
              kind: {
                FunctionCall: {
                  receiver_id: this.config.tokenFactoryContractName,
                  actions: [
                    {
                      method_name: 'create_token',
                      args: tokenArgsInBase64,
                      deposit: ONE_YOKTO_NEAR.mul(new BN(5)).toString(),
                      gas: '150000000000000',
                    },
                  ],
                },
              },
            },
          },
          GAS_VALUE,
          MINIMAL_BOND
        ),
      ],
      blockHash
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private async getVoteApproveProposalTransaction(
    daoId: string,
    // TODO how do we get proposal id in batched transactions?
    proposalId: string,
    nonce: number,
    blockHash: Uint8Array
  ) {
    return SputnikNearService.buildTransaction(
      daoId,
      nonce,
      [
        transactions.functionCall(
          'act_proposal',
          {
            id: proposalId,
            action: 'VoteApprove',
          },
          GAS_VALUE,
          MINIMAL_BOND
        ),
      ],
      blockHash
    );
  }

  async createTokenFarmProposalTransaction(daoName: string) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const proposalTokenFarmTrx = await this.getProposalTokenFarmTransaction(
      'MyAwsomeToken',
      'MAT',
      10,
      daoName,
      defaultNonce + 1,
      blockHash
    );

    const trxs = [proposalTokenFarmTrx];

    return this.executeTransactions(trxs);
  }

  private getCreateStakingContractTransaction(
    stakingContractName: string,
    // TODO how do we get key?
    recoveryKey: string,
    nonce: number,
    blockHash: Uint8Array
  ) {
    return SputnikNearService.buildTransaction(
      this.config.contractName,
      nonce,
      [
        transactions.functionCall(
          'create',
          {
            name: stakingContractName,
            hash: '4ThdGjTKbBTad45CyePPAiZmWJEpEoFwViFusy4cpEmA',
            'Cg== ': '',
            access_keys: [recoveryKey],
          },
          GAS_VALUE,
          ONE_YOKTO_NEAR.mul(new BN(5))
        ),
      ],
      blockHash
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private async getInitStakingTransaction(
    stakingContract: string,
    daoId: string,
    tokenContract: string,
    nonce: number,
    blockHash: Uint8Array
  ) {
    return SputnikNearService.buildTransaction(
      stakingContract,
      nonce,
      [
        transactions.functionCall(
          'new',
          {
            token_id: tokenContract,
            owner_id: daoId,
            unstake_period: '604800000000000',
          },
          GAS_VALUE,
          new BN(0)
        ),
      ],
      blockHash
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private async getTokenStorageCallTransaction(
    tokenContract: string,
    stakingContract: string,
    nonce: number,
    blockHash: Uint8Array
  ) {
    return SputnikNearService.buildTransaction(
      tokenContract,
      nonce,
      [
        transactions.functionCall(
          'ft_balance_of',
          {
            account_id: stakingContract,
          },
          GAS_VALUE,
          new BN(0)
        ),
      ],
      blockHash
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private async getAdoptStakingContractTransaction(
    daoId: string,
    stakingContract: string,
    nonce: number,
    blockHash: Uint8Array
  ) {
    return SputnikNearService.buildTransaction(
      daoId,
      nonce,
      [
        transactions.functionCall(
          'add_proposal',
          {
            proposal: {
              description: 'Adopt staking contract',
              kind: {
                SetStakingContract: {
                  staking_id: stakingContract,
                },
              },
            },
          },
          GAS_VALUE,
          ONE_YOKTO_NEAR
        ),
      ],
      blockHash
    );
  }

  async createStakingContract(daoId: string, tokenSymbol: string) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    // TODO is it the correct way to create token name?
    const tokenContract = `${tokenSymbol}${this.config.tokenFactoryContractName}`;

    const daoName = daoId.replace(this.config.contractName, '');

    const stakingContractName = `staking-${daoName}`;
    // TODO is it the correct way to create staking contract name?
    const stakingContract = `${stakingContractName}.${this.config.contractName}`;

    const createStakingContractTransaction = await this.getCreateStakingContractTransaction(
      stakingContractName,
      '8gzjvfJBxrHiUKiuhUebuC6X9HdmRt3PBMvJ2ChSXdTD',
      defaultNonce + 1,
      blockHash
    );

    const initStackingTransaction = await this.getInitStakingTransaction(
      stakingContract,
      daoId,
      tokenContract,
      defaultNonce + 2,
      blockHash
    );

    const tokenStorageCall = await this.getTokenStorageCallTransaction(
      tokenContract,
      stakingContract,
      defaultNonce + 3,
      blockHash
    );

    const doptStakingContractTransaction = await this.getAdoptStakingContractTransaction(
      daoId,
      stakingContract,
      defaultNonce + 4,
      blockHash
    );

    return SputnikNearService.sendTransactions(
      compact([
        createStakingContractTransaction,
        initStackingTransaction,
        tokenStorageCall,
        doptStakingContractTransaction,
      ])
    );
  }

  async getStackingContract(daoId: string) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const trx = await SputnikNearService.buildTransaction(
      daoId,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'get_staking_contract',
          {},
          new BN(0),
          new BN(0)
        ),
      ],
      blockHash
    );

    return this.executeTransactions(trx);
  }

  async setStorageStaking(stakingContract: string) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const trx = await SputnikNearService.buildTransaction(
      stakingContract,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'storage_deposit',
          {},
          GAS_VALUE,
          ONE_YOKTO_NEAR
        ),
      ],
      blockHash
    );

    return this.executeTransactions(trx);
  }

  async setStorageFt(tokenContract: string, stakingContract?: string) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const trx = await SputnikNearService.buildTransaction(
      tokenContract,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'storage_deposit',
          {
            account_id: stakingContract,
          },
          GAS_VALUE,
          ONE_YOKTO_NEAR
        ),
      ],
      blockHash
    );

    return this.executeTransactions(trx);
  }

  async setFtTransferCall(
    stakingContract: string,
    tokenContract: string,
    amount: number
  ) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const trx = await SputnikNearService.buildTransaction(
      tokenContract,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'ft_transfer_call',
          {
            receiver_id: stakingContract,
            amount: new BN(amount).mul(ONE_YOKTO_NEAR).toString(),
            // The message needs to be empty, in other case the contract panics
            msg: '',
          },
          GAS_VALUE,
          ONE_YOKTO_NEAR
        ),
      ],
      blockHash
    );

    return this.executeTransactions(trx);
  }

  async setFTDelegation(amount: number, stakingContract: string) {
    const accountId = SputnikNearService.getAccountId();

    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const trx = await SputnikNearService.buildTransaction(
      stakingContract,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'delegate',
          {
            account_id: accountId,
            amount: new BN(amount).mul(ONE_YOKTO_NEAR).toString(),
          },
          GAS_VALUE,
          new BN(0)
        ),
      ],
      blockHash
    );

    return this.executeTransactions(trx);
  }

  async getStakingBalance(stakingContract: string) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const accountId = SputnikNearService.getAccountId();

    const trx = await SputnikNearService.buildTransaction(
      stakingContract,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'get_user',
          {
            account_id: accountId,
          },
          GAS_VALUE,
          new BN(0)
        ),
      ],
      blockHash
    );

    return this.executeTransactions(trx);
  }

  async getTotalDelegationSupply(daoId: string) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const trx = await SputnikNearService.buildTransaction(
      daoId,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'delegation_total_supply',
          {},
          GAS_VALUE,
          new BN(0)
        ),
      ],
      blockHash
    );

    return this.executeTransactions(trx);
  }

  async createDaoProposePoll(
    daoId: string,
    question = 'Are we token weighted?'
  ) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    const trx = await SputnikNearService.buildTransaction(
      daoId,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'add_proposal',
          {
            proposal: {
              description: question,
              kind: 'Vote',
            },
          },
          GAS_VALUE,
          MINIMAL_BOND
        ),
      ],
      blockHash
    );

    return this.executeTransactions(trx);
  }

  async getDaoProposalsListTransaction(
    daoId: string,
    from?: number,
    limit?: number
  ) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    return SputnikNearService.buildTransaction(
      daoId,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'get_proposals',
          {
            from_index: from,
            limit,
          },
          GAS_VALUE,
          new BN(0)
        ),
      ],
      blockHash
    );
  }

  async getApproveProposalTransaction(daoId: string, proposalId: number) {
    const {
      blockHash,
      defaultNonce,
    } = await this.getBlockHashAndDefaultNonce();

    return SputnikNearService.buildTransaction(
      daoId,
      defaultNonce + 1,
      [
        transactions.functionCall(
          'act_proposal',
          {
            id: proposalId,
            action: 'VoteApprove',
          },
          GAS_VALUE,
          new BN(0)
        ),
      ],
      blockHash
    );
  }
}

export const SputnikWeightedPoliceService = new SputnikWeightedPoliceServiceClass(
  nearConfig
);
