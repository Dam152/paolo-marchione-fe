'use client';

import { CategoryCard } from '@/components/molecules/CategoryCard/CategoryCard';
import { VideoCard } from '@/components/molecules/VideoCard';
import { CategoryDocument } from '../../../../prismicio-types';
import { Fragment, useEffect, useState } from 'react';
import { css } from '../../../../panda/css';

type CategoryGridProps = {
  categories: CategoryDocument[];
  preloadCount?: number;
};

const dimmable = css({
  w: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'opacity 0.5s ease',
});

export function CategoryGrid({ categories, preloadCount = 4 }: CategoryGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleCategoryClick(id: string) {
    setActiveId((prev) => (prev !== null ? null : id));
  }

  useEffect(() => {
    function handleWindowClick() {
      setActiveId(null);
    }
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  let videoIndex = 0;

  return (
    <>
      {categories.map((category) => {
        const dimmed = activeId !== null && activeId !== category.id;
        const opacity = dimmed ? 0.2 : 1;

        return (
          <Fragment key={category.id}>
            <CategoryCard
              title={category.data.title}
              className={dimmable}
              style={{ opacity }}
              onClick={() => handleCategoryClick(category.id)}
            />
            {category.data.video.map((item, index) => {
              const isPreload = videoIndex++ < preloadCount;
              return (
                <div key={item.image.id || index} className={dimmable} style={{ opacity }}>
                  <VideoCard
                    image={item.image}
                    videoUrl={item.video}
                    title={item.title}
                    starring={item.starring}
                    client={item.client}
                    production={item.production}
                    preload={isPreload}
                  />
                </div>
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}
