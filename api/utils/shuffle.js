// 📂 /api/utils/shuffle.js

exports.shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};
