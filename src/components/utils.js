import React, { useLayoutEffect, useState } from 'react';

/*function useWindowSize() {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function ShowWindowDimensions(props) {
  const width = useWindowSize();
  return <span>Window size: {width}</span>;
}*/

export function getImageSize() {
  let size = 0;
  useLayoutEffect(() => {
    function updateSize() {
      size(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}