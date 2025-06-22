import { RefObject } from 'react';

export const focusInputField = (ref: RefObject<HTMLInputElement>) =>
  setTimeout(() => ref.current?.focus(), 0);
