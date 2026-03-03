import { ComponentProps, ReactNode } from 'react';

import { cx } from '../../../../panda/css';
import { ButtonVariantProps, button } from '../../../../panda/recipes';

type ButtonProps = ComponentProps<'button'> &
  ButtonVariantProps & {
    className?: string;
    children?: ReactNode;
  };

export function Button({ className, children, variant, ...buttonProps }: ButtonProps) {
  const buttonStyles = button({ variant });

  return (
    <button className={cx(className, buttonStyles)} {...buttonProps}>
      {children}
    </button>
  );
}
