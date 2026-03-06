'use client';

import { CategoryCard } from '@/components/molecules/CategoryCard/CategoryCard';
import { VideoCard } from '@/components/molecules/VideoCard';
import { VideoLightbox, VideoItem } from '@/components/molecules/VideoLightbox';
import { CategoryDocument } from '../../../../prismicio-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  md: {
    '&[data-dimmed="true"]': { opacity: 0.2 },
  },
});

const videoWrapper = css({
  animation: 'fadeIn 0.4s ease backwards',
  animationDelay: 'var(--mobile-delay, 0s)',
  md: {
    animation: 'fadeIn 0.6s ease backwards',
    animationDelay: 'var(--video-delay, 0s)',
  },
});

const categoryWrapper = css({
  gridColumn: '1 / -1',
  md: { display: 'contents' },
});

const videosCollapsible = css({
  overflow: 'hidden',
  transition: 'max-height 0.35s ease',
  md: { display: 'contents', overflow: 'visible' },
});

export function CategoryGrid({ categories, preloadCount = 4 }: CategoryGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mountedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function handleCategoryClick(id: string) {
    setActiveId((prev) => (prev === id ? null : id));
    mountedIds.current.add(id);
  }

  useEffect(() => {
    function handleWindowClick() { setActiveId(null); }
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  const playableVideos = useMemo<VideoItem[]>(() =>
    categories.flatMap((cat) =>
      cat.data.video
        .filter((item) => !!item.video?.html)
        .map((item) => ({
          title: item.title,
          starring: item.starring,
          client: item.client,
          production: item.production,
          videoUrl: item.video,
        }))
    ),
    [categories]
  );

  const handleClose = useCallback(() => setOpenIndex(null), []);
  const handlePrev = useCallback(() => setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const handleNext = useCallback(() => setOpenIndex((i) => (i !== null && i < playableVideos.length - 1 ? i + 1 : i)), [playableVideos.length]);

  let videoIndex = 0;
  let playableIndex = 0;

  return (
    <>
      {categories.map((category, categoryIndex) => {
        const focusId = activeId ?? hoveredId;
        const dimmed = focusId !== null && focusId !== category.id;
        const isActive = activeId === category.id;
        const shouldMount = isDesktop || isActive || mountedIds.current.has(category.id);

        return (
          <div key={category.id} className={categoryWrapper}>
            <CategoryCard
              title={category.data.title}
              className={dimmable}
              style={{ animationDelay: `${categoryIndex * 0.08}s` }}
              dimmed={dimmed}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              isActive={isActive}
            />

            <div
              className={videosCollapsible}
              style={{ maxHeight: isActive ? `${category.data.video.length * 100}vw` : '0' }}
              onClick={(e) => e.stopPropagation()}
            >
              {shouldMount &&
                category.data.video.map((item, index) => {
                  const isPreload = videoIndex < preloadCount;
                  const videoDelay = videoIndex++;
                  const hasVideo = !!item.video?.html;
                  const currentPlayableIndex = hasVideo ? playableIndex++ : -1;

                  return (
                    <div
                      key={item.image.id || index}
                      className={`${dimmable} ${videoWrapper}`}
                      data-dimmed={dimmed || undefined}
                      style={{
                        '--video-delay': `${videoDelay * 0.06}s`,
                        '--mobile-delay': `${index * 0.05}s`,
                      } as React.CSSProperties}
                    >
                      <VideoCard
                        image={item.image}
                        videoUrl={item.video}
                        title={item.title}
                        preload={isPreload}
                        disabled={dimmed}
                        onOpen={currentPlayableIndex >= 0 ? () => setOpenIndex(currentPlayableIndex) : undefined}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}

      <VideoLightbox
        videos={playableVideos}
        openIndex={openIndex}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  );
}
