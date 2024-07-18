export type OptionaAtributs<T> = {
  [K in keyof T]?: T[K];
};
