/**
 * Generates random string from alphabets and numbers
 * @returns {String}
 */
const getRandomString = () => {
  // eslint-disable-next-line prettier/prettier
  const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const picks = [];
  for (let i = 0; i < 5; i += 1) {
    const key = Math.floor(Math.random() * alphabets.length);
    picks.push(alphabets[key].toUpperCase());
  }
  for (let k = 0; k < 3; k += 1) {
    const pin = Math.floor(Math.random() * numbers.length);
    picks.push(numbers[pin]);
  }
  let referralCode = picks.toString();
  referralCode = referralCode.replace(/,/g, '');
  return referralCode;
};

module.exports = getRandomString;
