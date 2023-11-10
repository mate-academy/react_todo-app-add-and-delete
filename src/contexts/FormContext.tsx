import {
  createContext,
  useState,
} from 'react';

interface FormContextType {
  isCreating: boolean,
  setIsCreating: (value: boolean) => void,
  preparingTodoLabel: string,
  setPreparingTodoLabel: (value: string) => void,
}

export const FormContext = createContext<FormContextType>({
  isCreating: false,
  setIsCreating: () => {},
  preparingTodoLabel: '',
  setPreparingTodoLabel: () => {},
});

export const FormProvider = (
  { children }: { children: React.ReactNode },
) => {
  const [isCreating, setIsCreating] = useState(false);
  const [preparingTodoLabel, setPreparingTodoLabel] = useState('');

  return (
    <FormContext.Provider
      value={{
        isCreating,
        setIsCreating,
        preparingTodoLabel,
        setPreparingTodoLabel,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
