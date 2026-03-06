'use client';

import { CategoryCard } from '@/components/molecules/CategoryCard/CategoryCard';
import { VideoCard } from '@/components/molecules/VideoCard';
import { CategoryDocument } from '../../../../prismicio-types';
import { Fragment, useEffect, useState } from 'react';
import { css } from '../../../../panda/css';
import { ToggleGroup } from '@ark-ui/react/toggle-group';

type CategoryGridProps = {
  categories: CategoryDocument[];
  preloadCount?: number;
};

const dimmable = css({
  w: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'opacity 0.5s ease',
  animation: 'fadeIn 0.6s ease backwards',
});

export function CategoryGrid({ categories, preloadCount = 4 }: CategoryGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function handleCategoryClick(id: string) {
    setActiveId((prev) => {
      if (prev === null) return id;
      if (prev === id) return null;
      return null;
    });
  }

  useEffect(() => {
    function handleWindowClick() {
      setActiveId(null);
    }
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  let videoIndex = 0;
  let itemIndex = 0;

  return (
    <>
      {/* Mobile filter tags */}
      <ToggleGroup.Root
        multiple={false}
        value={activeId ? [activeId] : []}
        onValueChange={({ value }) => {
          const next = value[0] ?? null;
          setActiveId(next);
        }}
        onClick={(e) => e.stopPropagation()}
        className={css({
          display: { base: 'flex', md: 'none' },
          flexWrap: 'wrap',
          gap: '8px',
          w: '100%',
          gridColumn: '1 / -1',
          mb: '24px',
          animation: 'fadeIn 0.6s ease backwards',
        })}
      >
        {categories.map((category) => (
          <ToggleGroup.Item
            key={category.id}
            value={category.id}
            className={css({
              px: '16px',
              py: '8px',
              bg: 'Gray',
              color: 'Black',
              '&[data-state=on]': { bg: 'Black', color: 'White' },
              fontSize: '1.6rem',
              fontFamily: 'neueMontreal',
              transition: 'background-color 0.3s ease',
              cursor: 'pointer',
              border: 'none',
            })}
          >
            {category.data.title}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>

      {categories.map((category) => {
        const focusId = activeId ?? hoveredId;
        const dimmed = focusId !== null && focusId !== category.id;
        const opacity = dimmed ? 0.2 : 1;
        const cardDelay = itemIndex++;

        return (
          <Fragment key={category.id}>
            <CategoryCard
              title={category.data.title}
              className={dimmable}
              style={{ opacity, animationDelay: `${cardDelay * 0.06}s` }}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              isActive={activeId === category.id}
            />
            {category.data.video.map((item, index) => {
              const isPreload = videoIndex++ < preloadCount;
              const videoDelay = itemIndex++;
              return (
                <div
                  key={item.image.id || index}
                  className={dimmable}
                  style={{ opacity, animationDelay: `${videoDelay * 0.06}s` }}
                >
                  <VideoCard
                    image={item.image}
                    videoUrl={item.video}
                    title={item.title}
                    starring={item.starring}
                    client={item.client}
                    production={item.production}
                    preload={isPreload}
                    disabled={dimmed}
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
