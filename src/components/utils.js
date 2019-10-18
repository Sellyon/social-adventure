import React, { useLayoutEffect, useState } from 'react';

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