'use client';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { css, cx } from '../../panda/css';
import { container } from '../../panda/patterns';
import { text } from '../../panda/recipes';

const styles = {
  root: css({
    w: '100%',
    h: 'var(--root-height-less-header, 958px)',
  }),

  container: css({
    h: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
  }),

  button: text({
    fontSize: 'bodyLarge',
    textColor: 'Black',
  }),
};

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.root}>
      <div className={cx(container(), styles.container)}>
        <Text>Something went wrong</Text>
        <Button className={styles.button} onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
