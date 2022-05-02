import { useEffect, useState } from 'react';

const useMatchMedia: (condition: string) => [boolean] = (condition) => {
  const [isMatching, setIsMatching] = useState(false);

  useEffect(
    function updateMatchMedia() {
      if (!condition) return setIsMatching(true);

      const updateIsMatching = (event: MediaQueryListEvent) =>
        setIsMatching(event.matches);

      const matcher = window.matchMedia(condition);

      setIsMatching(matcher.matches);

      matcher.addEventListener('change', updateIsMatching);

      return () => {
        matcher.removeEventListener('change', updateIsMatching);
      };
    },
    [condition]
  );

  return [isMatching];
};

export default useMatchMedia;
