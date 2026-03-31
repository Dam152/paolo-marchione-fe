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
  tab: {
    '&[data-dimmed="true"]': { opacity: 0.2 },
  },
});

const videoWrapper = css({
  animation: 'fadeIn 0.4s ease backwards',
  animationDelay: 'var(--mobile-delay, 0s)',
  tab: {
    animation: 'fadeIn 0.6s ease backwards',
    animationDelay: 'var(--video-delay, 0s)',
  },
});

const categoryWrapper = css({
  gridColumn: '1 / -1',
  tab: { display: 'contents' },
});

const videosCollapsible = css({
  overflow: 'hidden',
  transition: 'max-height 0.35s ease',
  tab: { display: 'contents', overflow: 'visible' },
});

export function CategoryGrid({ categories, preloadCount = 4 }: CategoryGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mountedIds = useRef<Set<string>>(new Set());
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const collapsibleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const activeIdBeforeLightbox = useRef<string | null>(null);
  const skipNextWindowClick = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function handleCategoryClick(id: string) {
    const newActiveId = activeId === id ? null : id;
    setActiveId(newActiveId);
    mountedIds.current.add(id);

    const isMobile = !window.matchMedia('(min-width: 640px)').matches;
    if (isMobile) {
      const targetEl = categoryRefs.current.get(id);
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();

      if (newActiveId !== null) {
        let top = rect.top + window.scrollY;

        if (activeId !== null && activeId !== id) {
          const prevWrapperEl = categoryRefs.current.get(activeId);
          const prevCollapsibleEl = collapsibleRefs.current.get(activeId);
          if (prevWrapperEl && prevCollapsibleEl) {
            const prevAbsTop = prevWrapperEl.getBoundingClientRect().top + window.scrollY;
            if (prevAbsTop < top) {
              top -= prevCollapsibleEl.offsetHeight;
            }
          }
        }

        window.scrollTo({ top: Math.max(0, top - 160), behavior: 'instant' });
      } else if (rect.top < 0) {
        window.scrollTo({ top: rect.top + window.scrollY, behavior: 'instant' });
      }
    }
  }

  useEffect(() => {
    if (openIndex !== null) return;
    function handleWindowClick() {
      if (skipNextWindowClick.current) {
        skipNextWindowClick.current = false;
        return;
      }
      setActiveId(null);
    }
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [openIndex]);

  const playableVideos = useMemo<VideoItem[]>(
    () =>
      categories.flatMap((cat) =>
        cat.data.video
          .filter((item) => !!item.video?.html || !!item.overlay_image?.url)
          .map((item) => ({
            metadata: [
              ...(item.title ? [{ label: 'Title', text: item.title }] : []),
              ...(item.metadata ?? []),
            ],
            videoUrl: item.video,
            overlayImage: item.overlay_image?.url ? item.overlay_image : undefined,
          })),
      ),
    [categories],
  );

  const handleClose = useCallback(() => {
    skipNextWindowClick.current = true;
    setOpenIndex(null);
    setActiveId(activeIdBeforeLightbox.current);
  }, []);
  const handlePrev = useCallback(() => setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const handleNext = useCallback(
    () => setOpenIndex((i) => (i !== null && i < playableVideos.length - 1 ? i + 1 : i)),
    [playableVideos.length],
  );

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
          <div
            key={category.id}
            className={categoryWrapper}
            ref={(el) => {
              if (el) categoryRefs.current.set(category.id, el);
              else categoryRefs.current.delete(category.id);
            }}
          >
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
              ref={(el) => {
                if (el) collapsibleRefs.current.set(category.id, el);
                else collapsibleRefs.current.delete(category.id);
              }}
            >
              {shouldMount &&
                category.data.video.map((item, index) => {
                  const isPreload = videoIndex < preloadCount;
                  const videoDelay = videoIndex++;
                  const hasVideo = !!item.video?.html || !!item.overlay_image?.url;
                  const currentPlayableIndex = hasVideo ? playableIndex++ : -1;

                  return (
                    <div
                      key={item.image.id || index}
                      className={`${dimmable} ${videoWrapper}`}
                      data-dimmed={dimmed || undefined}
                      style={
                        {
                          '--video-delay': `${videoDelay * 0.06}s`,
                          '--mobile-delay': `${index * 0.05}s`,
                        } as React.CSSProperties
                      }
                    >
                      <VideoCard
                        image={item.image}
                        videoUrl={item.video}
                        title={item.title}
                        preload={isPreload}
                        disabled={dimmed}
                        onOpenAction={
                          currentPlayableIndex >= 0
                            ? () => {
                                activeIdBeforeLightbox.current = activeId;
                                setOpenIndex(currentPlayableIndex);
                              }
                            : undefined
                        }
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
        onCloseAction={handleClose}
        onPrevAction={handlePrev}
        onNextAction={handleNext}
      />
    </>
  );
}
