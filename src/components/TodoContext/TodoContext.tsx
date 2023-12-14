import React, { useEffect, useState, useMemo } from 'react';

import * as postService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Filter } from '../../types/Filter';

type Props = {
  children: React.ReactNode;
};

interface TodoContextType {
  USER_ID: number,
  todos: Todo[],
  tempTodo: Todo | null,
  filteredTodos: Todo[],
  errorMessage: string,
  option: Filter,
  loading: null | number,
  addTodo: (newTodo: Todo) => void,
  deleteTodo: (todoId: number) => void
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<number | null>>,
  setOption: React.Dispatch<React.SetStateAction<Filter>>,
}

const USER_ID = 11906;

export const TodoContext = React.createContext<
TodoContextType
>({} as TodoContextType);

export const TodoProvider:React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [option, setOption] = useState(Filter.All);
  const [loading, setLoading] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(allTodos => {
        setTodos(allTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoad);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (option) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, option]);

  const addTodo = (newTodo: Todo) => {
    setTempTodo({ ...newTodo, id: 0 });
    setLoading(0);
    postService.createTodo(newTodo)
      .then((createdTodo) => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableToAdd))
      .finally(() => {
        setLoading(null);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoading(todoId);
    postService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableToDelete))
      .finally(() => setLoading(null));
  };

  const value = useMemo(() => ({
    USER_ID,
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    filteredTodos,
    errorMessage,
    setErrorMessage,
    option,
    setOption,
    loading,
    setLoading,
    deleteTodo,
    addTodo,
  }), [
    todos,
    tempTodo,
    filteredTodos,
    errorMessage,
    option,
    loading,
  ]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
