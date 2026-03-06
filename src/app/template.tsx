import { css } from '../../panda/css';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={css({
        animation: 'fadeIn 0.5s linear',
      })}
    >
      {children}
    </div>
  );
}
