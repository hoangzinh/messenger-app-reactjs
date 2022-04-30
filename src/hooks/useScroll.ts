import { useCallback, useEffect, useRef, useState } from 'react';

const useScroll = (onLoadMore: () => void) => {
  const containerRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentryRef = useRef<Element | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const id = setTimeout(onLoadMore, 50);
      return () => clearTimeout(id);
    }
  }, [visible, onLoadMore]);

  const unobserve = useCallback(() => {
    const currentObserver = observerRef.current;
    if (currentObserver) {
      currentObserver.disconnect();
    }

    observerRef.current = null;
    setVisible(false);
  }, []);

  const observe = useCallback(() => {
    if (sentryRef.current) {
      let options = {
        root: containerRef.current,
        rootMargin: '0px',
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }, options);

      observerRef.current = observer;

      observer.observe(sentryRef.current);
    }
  }, []);

  const loadMoreRefCallback = useCallback(
    (el: Element | null) => {
      sentryRef.current = el;
      unobserve();
      observe();
    },
    [observe, unobserve]
  );

  const containerRefCallback = useCallback(
    (el: Element | null) => {
      containerRef.current = el;
      unobserve();
      observe();
    },
    [observe, unobserve]
  );

  return {
    loadMoreRef: loadMoreRefCallback,
    containerRef: containerRefCallback,
  };
};

export default useScroll;
