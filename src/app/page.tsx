import { createClient } from '@/prismicio';
import { css, cx } from '../../panda/css';
import { container } from '../../panda/patterns';
import { Text } from '@/components/atoms/Text';
import { CategoryGrid } from '@/components/molecules/CategoryGrid/CategoryGrid';
import JsonLD from '@/components/molecules/JsonLD/JsonLD';

export default async function Home() {
  const client = createClient();
  const categories = await client.getAllByType('category', {
    orderings: [{ field: 'document.first_publication_date', direction: 'asc' }],
  });

  const settings = await client.getSingle('settings');

  return (
    <>
      <div
        className={cx(
          container(),
          css({
            w: '100%',
            display: 'grid',
            gridTemplateColumns: {
              base: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            pb: '138px',
          }),
        )}
      >
        <Text as="h1" className={css({ srOnly: true })}>
          Paolo Marchione
        </Text>

        <CategoryGrid categories={categories} />
      </div>
      <JsonLD
        type="Organization"
        data={{
          description: settings.data.meta_description || settings.data.menu_voice[1]?.content || '',
          lang: settings.lang,
        }}
      />
    </>
  );
}
