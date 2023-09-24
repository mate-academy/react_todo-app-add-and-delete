/* eslint-disable no-console */
import {
  PropsWithChildren, createContext, useContext, useState,
} from 'react';
import { ErrorsContext } from '../ErrorsProvider/ErrorsProvider';
import { addTodo } from '../../api/todos';

type NewTodoContextType = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, input: string) => void,
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
  todoInput: string,
};

export const NewTodoContext
= createContext<NewTodoContextType | undefined>(undefined);

export const NewTodoProvider = ({ children }: PropsWithChildren) => {
  const [todoInput, setTodoInput] = useState('');

  const errorsContext = useContext(ErrorsContext);

  if (!errorsContext) {
    return null;
  }

  const { addError } = errorsContext;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoInput(e.target.value.trimStart());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todoInput.length === 0) {
      addError('errorEmptyTitle');
    } else {
      const data = {
        userId: 11524,
        title: todoInput,
        completed: false,
      };

      addTodo(11524, data)
        .then(() => setTodoInput(''));
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
