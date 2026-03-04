import { Button } from '@/components/atoms/Button';
import { KeyTextField } from '@prismicio/client';
import { CSSProperties } from 'react';
import { css, cx } from '../../../../panda/css';
import { text } from '../../../../panda/recipes';

type CategoryCardProps = {
  title: string | KeyTextField;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function CategoryCard({ title, className = '', style, onClick }: CategoryCardProps) {
  return (
    <div
      data-aos="fade-up"
      className={cx(className, css({ w: '100%' }))}
      style={style}
      suppressHydrationWarning
    >
      <Button
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        className={cx(
          text({ fontSize: 'bodyLarge', textColor: 'Black' }),
          css({
            w: '100%',
            aspectRatio: '1/1',
            bg: 'Gray',
            transition: 'opacity 0.5s ease',
            _hover: {
              opacity: 0.8,
            },
          }),
        )}
      >
        {title}
      </Button>
    </div>
  );
}
