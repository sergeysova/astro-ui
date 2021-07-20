import React from 'react';
import classNames from 'classnames';
import styles from './button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'tertiary';
  size: 'small' | 'medium' | 'large' | 'block';
  disabled: boolean | undefined;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className: classNameProp,
  ...props
}) => {
  const variants = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary
  };
  const sizes = {
    small: styles['size-small'],
    medium: styles['size-medium'],
    large: styles['size-large'],
    block: styles['size-block']
  };
  const className = classNames(
    styles.btn,
    variants[variant],
    sizes[size],
    classNameProp
  );

  return (
    <button type="button" disabled={disabled} className={className} {...props}>
      {children}
    </button>
  );
};
