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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isActive?: boolean;
  dimmed?: boolean;
};

export function CategoryCard({
  title,
  className = '',
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isActive = false,
  dimmed,
}: CategoryCardProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-dimmed={dimmed || undefined}
      className={cx(
        className,
        css({
          w: '100%',
          display: 'block',
          animation: 'fadeIn 0.6s ease backwards',
        }),
      )}
      style={style}
      suppressHydrationWarning
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={cx(
          text({ fontSize: 'bodyLarge', textColor: 'Black' }),
          css({
            w: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: '24px',
            py: '20px',
            bg: 'Gray',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            tab: {
              display: 'block',
              aspectRatio: '1/1',
              px: '0',
              py: '0',
              textAlign: 'center',
              bg: isActive ? 'Black' : 'Gray',
              color: isActive ? 'white' : 'black',
              ...(!isActive && {
                _hover: {
                  bg: 'Black',
                  color: 'white',
                },
              }),
            },
          }),
        )}
      >
        {title}
      </Button>
    </div>
  );
}
