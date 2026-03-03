import { HTMLAttributes, ReactNode } from 'react';

import { TextVariantProps, text } from '../../../../panda/recipes';

type TextProps = TextVariantProps &
  HTMLAttributes<HTMLElement> & {
    as?:
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'span'
      | 'p'
      | 'strong'
      | 'em'
      | 'b'
      | 'i'
      | 'u'
      | 'small'
      | 'mark'
      | 'del'
      | 'ins'
      | 'sub'
      | 'sup'
      | 'label';

    className?: string;
    children?: ReactNode;
  };

export function Text({
  as = 'span',
  className,
  children,
  fontSize = 'bodyLarge',
  font,
  fontWeight,
  textColor = 'Black',
  ...props
}: TextProps) {
  const Component = as;
  return (
    <Component
      className={`${text({ font, fontSize, fontWeight, textColor })} ${className ?? ''}`}
      {...props}
    >
      {children}
    </Component>
  );
}
