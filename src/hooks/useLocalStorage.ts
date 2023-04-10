import { useState } from 'react';

type Value = string | number | object;

export const useLocalStorage = (key: string, initialValue: Value) => {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue)),
  );

  const save = (newValue: Value) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, save];
};
