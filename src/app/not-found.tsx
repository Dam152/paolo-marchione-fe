import Link from 'next/link';
import { css, cx } from '../../panda/css';
import { container } from '../../panda/patterns';
import { Text } from '@/components/atoms/Text';
import { NextLink } from '@/components/atoms/NextLink';
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
};

export default function NotFound() {
  return (
    <div className={styles.root}>
      <div className={cx(container(), styles.container)}>
        <Text as="h2">404 — Page not found</Text>
        <Text as="p">The page you are looking for does not exist.</Text>
        <NextLink
          className={text({ fontSize: 'bodyLarge', textColor: 'Black' })}
          type="link"
          href="/"
        >
          Go back home
        </NextLink>
      </div>
    </div>
  );
}
