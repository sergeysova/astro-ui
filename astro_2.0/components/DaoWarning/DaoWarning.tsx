import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import styles from './DaoWarning.module.scss';

interface DaoWarningProps {
  content: ReactNode;
  control?: ReactNode;
  className?: string;
  rootClassName?: string;
  statusClassName?: string;
  iconClassName?: string;
}

export const DaoWarning: FC<DaoWarningProps> = ({
  content,
  control,
  className,
  rootClassName,
  statusClassName,
  iconClassName,
}) => {
  return (
    <div className={className}>
      <div className={cn(styles.root, rootClassName)}>
        <div className={cn(styles.status, statusClassName)}>
          <Icon name="info" className={cn(styles.icon, iconClassName)} />
        </div>
        <div className={styles.content}>{content}</div>
        {control && <div className={styles.control}>{control}</div>}
      </div>
    </div>
  );
};
