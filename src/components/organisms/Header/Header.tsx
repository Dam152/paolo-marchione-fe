import { createClient } from '@/prismicio';
import { css } from '../../../../panda/css';
import { env } from '@/config/env';
import { HeaderMenu } from '@/components/molecules/HeaderMenu';

const styles = {
  root: css({
    w: '100%',
    position: 'relative',
    zIndex: 62,
    bg: 'White',
    display: 'flex',
    flexDirection: 'column',
  }),
};

export async function Header() {
  const client = createClient();
  const settings = await client.getSingle('settings');

  return (
    <header className={styles.root}>
      <HeaderMenu items={settings.data.menu_voice} appName={env.NEXT_PUBLIC_APP_NAME} />
    </header>
  );
}
