import { createClient } from '@/prismicio';
import { css, cx } from '../../panda/css';
import { container } from '../../panda/patterns';
import { Fragment } from 'react/jsx-runtime';
import { CategoryCard } from '@/components/molecules/CategoryCard/CategoryCard';
import { Text } from '@/components/atoms/Text';
import { VideoCard } from '@/components/molecules/VideoCard';

export default async function Home() {
  const client = createClient();
  const categories = await client.getAllByType('category', {
    orderings: [{ field: 'document.first_publication_date', direction: 'asc' }],
  });

  return (
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

      {categories.map((category) => (
        <Fragment key={category.id}>
          <CategoryCard title={category.data.title} />
          {category.data.video.map((item, index) => (
            <VideoCard
              key={item.image.id || index}
              image={item.image}
              videoUrl={item.video}
              title={item.title}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
