export const generateTemporaryPassword = (): string => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '@#$%&*_+=[]{}';
  
    const randomUppercaseChar = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  
    const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
  
    const randomChars = [];
    for (let i = 0; i < 10; i++) {
      const charSet = lowercaseChars + uppercaseChars + specialChars;
      const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
      randomChars.push(randomChar);
    }
  
    const allChars = randomChars.concat(randomUppercaseChar, randomSpecialChar);
    allChars.sort(() => Math.random() - 0.5);
  
    return allChars.join('');
  };
  