import bcrypt from 'bcrypt';

export const hashString = (password: string) => {
    const saltRounds = 9;
    return bcrypt.hash(password, saltRounds);
  };
  
  export const validateHash = (password: string, passwordHashed: string) => {
    return bcrypt.compare(password, passwordHashed);
  };
  