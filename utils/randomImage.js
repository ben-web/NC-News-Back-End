'use strict';

exports.randomImageUrl = (width, height) => {
  const randomNumber = Math.floor(Math.random() * 85);
  return `https://picsum.photos/g/${width}/${height}?image=${randomNumber}`
}