export type FormInputContextValue = {
  ref: React.RefObject<HTMLInputElement>;
  focus(): void;
  setDisabled(newValue: boolean): void;
};
