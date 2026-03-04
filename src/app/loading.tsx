import { css, cx } from '../../panda/css';
import { container } from '../../panda/patterns';

const styles = {
  root: css({
    w: '100%',
    h: 'var(--root-height-less-header, 958px)',
  }),

  container: css({
    h: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  spinner: css({
    w: '48px',
    h: '48px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: 'Black',
    animation: 'spin 0.8s linear infinite, fadeIn 0.3s ease-out',
  }),
};

export default function Loading() {
  return (
    <div className={styles.root}>
      <div className={cx(container(), styles.container)}>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
}
