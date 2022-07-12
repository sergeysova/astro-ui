import { useMemo } from 'react';
import { configService } from 'services/ConfigService';
import { FunctionCallAction } from 'types/proposal';

export interface StreamInfo {
  amount: string;
  description: string;
  isAutoStartEnabled: boolean;
  ownerId: string;
  receiverId: string;
  tokensPerSec: string;
}

export function useRoketoStreamCheck(
  actions: FunctionCallAction[]
): { create: boolean; stream: StreamInfo } {
  const config = configService.get();
  const streamingContract = config.appConfig.ROKETO_CONTRACT_NAME;

  return useMemo(() => {
    const parsedActions = actions.map(action => {
      const args = JSON.parse(
        Buffer.from(action.args, 'base64').toString('utf-8')
      );

      if (args.msg) {
        args.msg = JSON.parse(args.msg);
      }

      return { ...action, args };
    });

    const streamingAction = parsedActions.find(
      action => action.args?.receiver_id === streamingContract
    );
    const request = streamingAction?.args?.msg?.Create?.request;

    return {
      stream: {
        amount: streamingAction?.args?.amount ?? '0',
        description: request?.description ?? '',
        isAutoStartEnabled: request?.is_auto_start_enabled ?? true,
        ownerId: request?.owner_id ?? '',
        receiverId: request?.receiver_id ?? '',
        tokensPerSec: request?.tokens_per_sec ?? '0',
      },
      create:
        typeof streamingAction !== 'undefined' &&
        typeof request !== 'undefined',
    };
  }, [actions, streamingContract]);
}
