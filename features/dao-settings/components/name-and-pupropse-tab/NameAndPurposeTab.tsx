import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/input/Input';
import { TextArea } from 'components/textarea/TextArea';
import { ProposalBanner } from 'features/dao-settings/components/proposal-banner';
import {
  getChangeConfigProposal,
  NameAndPurposeData
} from 'features/dao-settings/helpers';
import React, { useCallback, VFC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useToggle } from 'react-use';
import { SputnikService } from 'services/SputnikService';
import * as yup from 'yup';
import { DaoConfig } from 'types/proposal';
import {
  DaoMetadata,
  fromMetadataToBase64
} from 'services/SputnikService/mappers/dao';
import styles from './name-and-purpose-tab.module.scss';

export const schema = yup.object().shape({
  displayName: yup.string().min(2).required(),
  purpose: yup.string().max(500)
});

export interface NameAndPurposeTabProps {
  daoId: string;
  name: string;
  purpose: string;
  currentDaoMetadata: DaoMetadata;
  proposalBond: string;
}

export const NameAndPurposeTab: VFC<NameAndPurposeTabProps> = ({
  daoId,
  name,
  purpose,
  currentDaoMetadata,
  proposalBond
}) => {
  const [viewMode, setViewMode] = useToggle(true);
  const [isSubmitting, setSubmitting] = useToggle(false);

  const getDisplayName = useCallback(() => {
    return currentDaoMetadata.displayName || name;
  }, [name, currentDaoMetadata.displayName]);

  const methods = useForm<NameAndPurposeData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      purpose,
      displayName: getDisplayName()
    },
    resolver: yupResolver(schema)
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, touchedFields, isDirty, isValid }
  } = methods;

  const onSubmit = useCallback(
    async (data: NameAndPurposeData) => {
      setSubmitting(true);

      const { links, flag } = currentDaoMetadata;

      const url = flag.split('/');
      const fileName = url[url.length - 1];

      const newDaoConfig: DaoConfig = {
        name,
        purpose: data.purpose,
        metadata: fromMetadataToBase64({
          links,
          flag: fileName,
          displayName: data.displayName
        })
      };

      await SputnikService.createProposal(
        getChangeConfigProposal(
          daoId,
          newDaoConfig,
          'Changing name/purpose',
          proposalBond
        )
      );
      setSubmitting(false);
      setViewMode(true);
    },
    [name, setSubmitting, currentDaoMetadata, daoId, proposalBond, setViewMode]
  );

  const onCancel = useCallback(() => {
    setViewMode(true);
    reset({
      purpose,
      displayName: getDisplayName()
    });
  }, [purpose, reset, setViewMode, getDisplayName]);

  function getDisableTooltip() {
    if (!isDirty) return 'You need to make changes to submit proposal';

    if (!isValid) return 'Some fields are invalid';

    return undefined;
  }

  return (
    <>
      <FormProvider {...methods}>
        <ProposalBanner
          scope="config"
          title="Name & Purpose"
          form="settings"
          disable={!isValid || !isDirty || isSubmitting}
          disableTooltip={getDisableTooltip()}
          onEdit={setViewMode}
          viewMode={viewMode}
          onCancel={onCancel}
        />
      </FormProvider>
      <form
        id="settings"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
      >
        <div className={styles.row}>
          <div className={styles.label}>Account name (cannot be changed)</div>
          <p>{daoId}</p>
        </div>
        <div className={styles.row}>
          <div>
            <div className={styles.label}>Display Name</div>
            {viewMode ? (
              <span>{getDisplayName()}</span>
            ) : (
              <Input
                {...register('displayName')}
                isValid={
                  touchedFields.displayName && !errors.displayName?.message
                }
                size="block"
                maxLength={500}
                textAlign="left"
              />
            )}
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <div className={styles.label}>Purpose</div>
            {viewMode ? (
              <span className={styles.purpose}>{purpose}</span>
            ) : (
              <TextArea
                {...register('purpose')}
                size="block"
                textAlign="left"
                resize="none"
                maxLength={500}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
};
