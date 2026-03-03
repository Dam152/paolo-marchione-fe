import { ComponentProps } from 'react';

import { cx } from '../../../../panda/css';
import { ButtonVariantProps, TextVariantProps, button, text } from '../../../../panda/recipes';

type NextLinkProps = Omit<ComponentProps<'a'>, 'href'> &
  ButtonVariantProps &
  TextVariantProps & {
    href: string;
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'link';
  };

export function NextLink({
  href,
  children,
  className,
  variant,
  fontSize,
  fontWeight,
  font,
  textColor,
  type = 'link',
  ...linkProps
}: NextLinkProps) {
  const buttonStyles = button({ variant });
  const textStyles = text({ fontSize, fontWeight, font, textColor });

  return (
    <a
      href={href}
      className={cx(className, type === 'button' ? buttonStyles : textStyles)}
      {...linkProps}
    >
      {children}
    </a>
  );
}
