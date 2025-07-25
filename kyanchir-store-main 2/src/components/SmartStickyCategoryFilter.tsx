import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  RefObject,
} from 'react';
import CategoryFilter from './CategoryFilter';
import { useSmartSticky } from './hooks/useSmartSticky';

const HEADER_HEIGHT = 65;

interface SmartStickyCategoryFilterProps {
  onSelectCategory: (categoryId: string) => void;
  initialCategory?: string;
  className?: string;
  workZoneRef: RefObject<HTMLElement | null>;
}

const SmartStickyCategoryFilter = forwardRef(function SmartStickyCategoryFilter(
  {
    onSelectCategory,
    initialCategory = 'all',
    className = '',
    workZoneRef,
  }: SmartStickyCategoryFilterProps,
  ref: React.Ref<any>,
) {
  const filterRef = useRef<HTMLDivElement>(null);
  const stickyCloneRef = useRef<HTMLDivElement>(null);

  const { shouldRender, isDocked, placeholderHeight, stickyStyles } =
    useSmartSticky(filterRef, workZoneRef, { headerHeight: HEADER_HEIGHT });

  // НОВАЯ ЛОГИКА АНИМАЦИИ
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (shouldRender) {
      setIsMounted(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Если стыковка — убираем клон сразу, иначе с анимацией
      const timeout = isDocked ? 0 : 300;
      const timer = setTimeout(() => setIsMounted(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [shouldRender, isDocked]);

  // Генерируем классы на лету
  const stickyWrapperClasses = [
    'fixed w-full z-[151] bg-white',
    // Если происходит "стыковка" - отключаем анимацию для мгновенного исчезновения
    isDocked ? 'transition-none' : 'transition-all duration-300 ease-in-out',
    // Если анимируется или уже "пристыкован" - прячем. Иначе - показываем.
    isAnimating && !isDocked
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-full',
  ]
    .filter(Boolean)
    .join(' ');

  // Остальная часть компонента без изменений
  useImperativeHandle(
    ref,
    () => ({
      /*...*/
    }),
    [],
  );

  return (
    <>
      <div
        ref={filterRef}
        style={{ height: isMounted ? placeholderHeight : 'auto' }}
        className={`w-full bg-white ${className}`}
      >
        <CategoryFilter
          onSelectCategory={onSelectCategory}
          activeCategory={initialCategory}
        />
      </div>
      {isMounted && (
        <div
          ref={stickyCloneRef}
          style={stickyStyles}
          className={stickyWrapperClasses}
          aria-hidden={!isMounted}
        >
          <CategoryFilter
            onSelectCategory={onSelectCategory}
            activeCategory={initialCategory}
          />
        </div>
      )}
    </>
  );
});

export default SmartStickyCategoryFilter;
