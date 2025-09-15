import { useRef } from 'react';

export function useInputRef() {
  return useRef<HTMLInputElement>(null);
}
