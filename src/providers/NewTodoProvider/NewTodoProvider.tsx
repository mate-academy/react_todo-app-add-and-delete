import {
  PropsWithChildren, createContext, useContext, useState,
} from 'react';
import { ErrorsContext } from '../ErrorsProvider/ErrorsProvider';

type NewTodoContextType = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, input: string) => void,
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
  todoInput: string,
};

export const NewTodoContext = createContext<NewTodoContextType>({
  handleSubmit: () => {},
  handleInput: () => {},
  todoInput: '',
});

export const NewTodoProvider = ({ children }: PropsWithChildren) => {
  const [todoInput, setTodoInput] = useState('');

  const errorsContext = useContext(ErrorsContext);
  const { addError } = errorsContext;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput(e.target.value.trimStart());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, input: string) => {
    e.preventDefault();
    if (input.length === 0) {
      addError('errorEmptyTitle');
    }
  };

  return (
    <NewTodoContext.Provider value={{
      handleSubmit,
      handleInput,
      todoInput,
    }}
    >
      {children}
    </NewTodoContext.Provider>
  );
};
