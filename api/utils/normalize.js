// utils/normalize.js

exports.normalizeAuthorName = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with one
      .split(' ')
      .map((word) =>
        word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ''
      )
      .join(' ');