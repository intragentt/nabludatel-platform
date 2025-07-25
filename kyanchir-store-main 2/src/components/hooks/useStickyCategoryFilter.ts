import { useRef, useState, useEffect } from 'react';

interface UseStickyCategoryFilterProps {
  headerHeight: number;
}

export function useStickyCategoryFilter({
  headerHeight,
}: UseStickyCategoryFilterProps) {
  const filterRef = useRef<HTMLDivElement>(null);
  const stickyCloneRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [isOriginalVisible, setIsOriginalVisible] = useState(true);
  const [shouldRenderSticky, setShouldRenderSticky] = useState(false);
  const [filterRect, setFilterRect] = useState({
    left: 0,
    width: 0,
    height: 56,
    top: 0,
  });

  useEffect(() => {
    function handleScroll() {
      if (filterRef.current) {
        const rect = filterRef.current.getBoundingClientRect();
        setFilterRect({
          left: rect.left,
          width: rect.width,
          height: rect.height,
          top: rect.top,
        });
        setIsOriginalVisible(rect.top >= headerHeight);
        setShowSticky(rect.top < headerHeight);
        setShouldRenderSticky(rect.top < headerHeight);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  return {
    filterRef,
    stickyCloneRef,
    showSticky,
    isOriginalVisible,
    shouldRenderSticky,
    filterRect,
  };
}
