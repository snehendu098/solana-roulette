const userSecretKey = [
  174, 66, 229, 109, 48, 237, 152, 98, 251, 55, 6, 167, 96, 136, 73, 25, 152,
  67, 165, 32, 141, 180, 199, 199, 243, 205, 49, 143, 252, 15, 184, 188, 50, 83,
  34, 195, 92, 34, 204, 108, 102, 177, 205, 150, 198, 133, 121, 97, 10, 9, 40,
  98, 92, 184, 238, 19, 174, 67, 22, 107, 124, 195, 34, 45,
];

const treasureSecretKey = [
  215, 186, 161, 14, 150, 14, 94, 157, 207, 29, 41, 107, 209, 175, 211, 134, 76,
  59, 33, 87, 88, 17, 140, 152, 233, 237, 212, 213, 233, 132, 146, 246, 161,
  228, 120, 6, 125, 162, 36, 136, 189, 226, 20, 137, 244, 111, 16, 170, 55, 204,
  87, 44, 186, 179, 217, 90, 250, 73, 127, 97, 104, 180, 202, 226,
];

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function totalAmtToBePaid(investment) {
  return investment;
}

function getReturnAmount(investment, stakeFactor) {
  return investment * stakeFactor;
}

module.exports = {
  randomNumber,
  totalAmtToBePaid,
  getReturnAmount,
  userSecretKey,
  treasureSecretKey,
};
