export type StateSetter<T> = (value: T | ((prev: T) => T)) => void;
