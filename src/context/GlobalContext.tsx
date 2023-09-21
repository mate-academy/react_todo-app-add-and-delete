import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../types/Todo';
import { postTodo, removeTodo } from '../api/todos';
import { ErrorEnum } from '../types/ErrorEnum';

type Props = {
  children: React.ReactNode;
};

interface GlobalContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => void;
  deleteTodo(id: number): Promise<void>;
  errorMessage: ErrorEnum | null;
  setErrorAndClear: (error: ErrorEnum, delay: number) => void;
  isInputDisabled: boolean;
  setIsInputDisabled: (arg: boolean) => void;
  removeAllCompleted: () => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo) => void;
  isDelitingIds: number[];
}

export const GlobalContext = React.createContext({} as GlobalContextType);

export const GlobalContextPropvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorEnum | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDelitingIds, setDeletingIds] = useState<number[]>([]);

  const setErrorAndClear = (error: ErrorEnum, delay: number) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, delay);
  };

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setIsInputDisabled(true);
    postTodo({ title, userId, completed })
      .then((res) => {
        setTodos((prevState) => [...prevState, res]);
      })
      .catch((err) => {
        setErrorMessage(ErrorEnum.ADD);
        throw new Error(err);
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
      });
  }

  async function deleteTodo(id: number) {
    setDeletingIds((ids) => [...ids, id]);
    try {
      await removeTodo(id);
      setTodos((prevState) => prevState.filter((item) => item.id !== id));
    } catch {
      setErrorMessage(ErrorEnum.DELETE);
    }
  }

  function removeAllCompleted() {
    const deletingIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setDeletingIds(prevIds => [...prevIds, ...deletingIds]);

    const promises = deletingIds.map((id) => removeTodo(id));

    Promise.all(promises)
      .then(() => {
        setTodos(
          (prevTodos) => prevTodos
            .filter((todo) => !deletingIds.includes(todo.id)),
        );
        setDeletingIds([]);
      })
      .catch((error) => {
        throw error;
      });
  }

  return (
    <GlobalContext.Provider
      value={{
        todos,
        setTodos,
        addTodo,
        deleteTodo,
        errorMessage,
        setErrorAndClear,
        isInputDisabled,
        setIsInputDisabled,
        removeAllCompleted,
        setTempTodo,
        tempTodo,
        isDelitingIds,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
