import React from 'react';
import { VotingButton as VotingButtonComponent } from 'components/button/VotingButton';
import { Meta } from '@storybook/react';

export const VotingButton = (): JSX.Element => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div>
      <VotingButtonComponent type="button" variant="yes">
        Yes
      </VotingButtonComponent>
      <VotingButtonComponent type="button" variant="no">
        No
      </VotingButtonComponent>
      <VotingButtonComponent type="button" variant="spam">
        Spam
      </VotingButtonComponent>
    </div>
  );
};

export default {
  title: 'Components/Buttons',
  component: VotingButtonComponent
} as Meta;
