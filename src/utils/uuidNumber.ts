import { v4 as uuidv4 } from 'uuid';

export const getuuidNumber = () => {
  const u = uuidv4();
  const numericId = parseInt(u.replace(/-/g, '').slice(0, 8), 16);

  return numericId % 100000000;
};
