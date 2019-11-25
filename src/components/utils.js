import React, { useLayoutEffect, useState } from 'react';
//const nodemailer = require('../node_modules/nodemailer');
const nodemailer = require("nodemailer");

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