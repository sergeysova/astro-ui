import React from 'react';
import cn from 'classnames';
import { Token } from 'features/types';
import styles from './bond.module.scss';

export interface BondProps {
  value: number;
  token: Token;
  className?: string;
}

export const Bond: React.FC<BondProps> = ({ value, token, className }) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.subtitle}>Bond</div>
      <div className={styles.valueWrapper}>
        <div className={styles.value}>{value}</div>
        <div className={cn(styles.token, styles.ml8)}>{token}</div>
      </div>
      <div className={styles.text}>
        To prevent spam, you must pay a bond. The bond will be returned when you
        complete the bounty before your deadline.
      </div>
    </div>
  );
};
