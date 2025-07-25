// Местоположение: src/hooks/useSmartSticky.ts

import { useState, useEffect, RefObject, useRef } from 'react';
import { useElementRect } from './useElementRect';
import { useScrollInfo } from './useScrollInfo';

// --- КОНСТАНТЫ ---
const STICKY_THRESHOLD = 50; // Дистанция в пикселях, которую надо проскроллить для срабатывания

export interface SmartStickyOptions {
  headerHeight: number;
}

export interface SmartStickyResult {
  shouldRender: boolean;
  isDocked: boolean;
  placeholderHeight: number;
  stickyStyles: React.CSSProperties;
}

export function useSmartSticky(
  targetRef: RefObject<HTMLElement | null>,
  workZoneRef: RefObject<HTMLElement | null>,
  options: SmartStickyOptions,
): SmartStickyResult {
  const { headerHeight } = options;

  const targetRect = useElementRect(targetRef);
  const workZoneRect = useElementRect(workZoneRef);
  const { scrollY, scrollDirection } = useScrollInfo();

  // "Память" хука
  const [isVisible, setIsVisible] = useState(false);
  // НОВАЯ ЛОГИКА: Запоминаем точку, где сменилось направление
  const scrollAnchorY = useRef(0);

  useEffect(() => {
    if (!targetRect || !workZoneRect) return;

    // --- ПРАВИЛО №1: Стыковка (самый высокий приоритет) ---
    // Если оригинал снова показался на экране, принудительно скрываем клон.
    if (targetRect.top >= headerHeight) {
      if (isVisible) setIsVisible(false);
      return;
    }

    // --- ПРАВИЛО №2: Рабочая зона ---
    const isInsideWorkZone =
      scrollY < workZoneRect.bottom + scrollY - headerHeight;
    if (!isInsideWorkZone) {
      if (isVisible) setIsVisible(false);
      return;
    }

    // --- ПРАВИЛО №3: Логика с порогом срабатывания ---
    if (scrollDirection === 'down') {
      // Когда скроллим вниз, просто запоминаем текущую позицию как "якорь"
      scrollAnchorY.current = scrollY;
      // И если клон был виден - прячем его
      if (isVisible) setIsVisible(false);
    } else if (scrollDirection === 'up') {
      // Когда скроллим вверх, показываем клон, ТОЛЬКО если
      // мы отдалились от нашего "якоря" больше, чем на STICKY_THRESHOLD.
      if (!isVisible && scrollAnchorY.current - scrollY > STICKY_THRESHOLD) {
        setIsVisible(true);
      }
    }
  }, [
    targetRect,
    workZoneRect,
    scrollY,
    scrollDirection,
    headerHeight,
    isVisible,
  ]);

  const isDocked = targetRect ? targetRect.top >= headerHeight : false;

  return {
    shouldRender: isVisible,
    isDocked: isDocked,
    placeholderHeight: targetRect?.height ?? 0,
    stickyStyles: {
      position: 'fixed',
      top: headerHeight,
      left: targetRect?.left ?? 0,
      width: targetRect?.width ?? 0,
    },
  };
}
