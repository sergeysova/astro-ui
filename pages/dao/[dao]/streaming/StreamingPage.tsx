import { NextPage } from 'next';
import { DaoContext } from 'types/context';

import Head from 'next/head';
import { useMemo } from 'react';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';
import { ProposalVariant } from 'types/proposal';

import styles from './StreamingPage.module.scss';

export interface StreamingPageProps {
  daoContext: DaoContext;
}

const StreamingPage: NextPage<StreamingPageProps> = ({
  daoContext,
  daoContext: { dao },
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);
  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.STREAMING,
    ];
  }, [breadcrumbsConfig]);

  function renderContent() {
    return (
      <>
        <Head>
          <title>Streaming</title>
        </Head>
        <div className={styles.root}>Hi!</div>
      </>
    );
  }

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeCustomFunctionCall}
      defaultFunctionCallType={FunctionCallType.CreateRoketoStream}
    >
      {renderContent()}
    </NestedDaoPageWrapper>
  );
};

export default StreamingPage;
