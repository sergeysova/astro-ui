import React, { FC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';

import styles from './DraftInfoItem.module.scss';

interface DraftInfoItemProps {
  className?: string;
  count: number;
  iconName: IconName;
  onClick?: () => void;
}

export const DraftInfoItem: FC<DraftInfoItemProps> = ({
  className,
  count,
  iconName,
  onClick,
}) => {
  const infoItem = (
    <>
      <div className={styles.count}>{count}</div>
      <Icon name={iconName} className={styles.icon} />
    </>
  );

  const renderInfo = () => {
    if (onClick) {
      return (
        <button
          className={cn(styles.button, className)}
          type="button"
          onClick={onClick}
        >
          {infoItem}
        </button>
      );
    }

    return (
      <div className={cn(styles.draftInfoItem, className)}>{infoItem}</div>
    );
  };

  return renderInfo();
};
