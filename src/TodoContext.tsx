import { createContext, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterOption } from './enums/FilterOption';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoContextType } from './types/TodoContextType';
import { Errors } from './enums/Errors';
import { deleteTodo } from './api/todos';
import { onErrors } from './utils/onErrors';

export const TodosContext = createContext<TodoContextType | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const TodoContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOption>(FilterOption.ALL);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [inputFocus, setInputFocus] = useState<boolean>(true);

  const preparedTodos = getFilteredTodos(todos, filterBy);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const onTodoDelete = (todoId: number): void => {
    setLoadingTodosIds(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );
      })
      .catch(() => {
        onErrors(Errors.DeleteTodo, setErrorMessage);
      })
      .finally(() => {
        setLoadingTodosIds([]);
        setInputFocus(true);
      });
  };

  const contextValues = {
    todos,
    setTodos,
    preparedTodos,
    activeTodos,
    completedTodos,
    errorMessage,
    setErrorMessage,
    onTodoDelete,
    tempTodo,
    setTempTodo,
    filterBy,
    setFilterBy,
    loadingTodosIds,
    setLoadingTodosIds,
    inputFocus,
    setInputFocus,
  };

  return (
    <TodosContext.Provider value={contextValues}>
      {children}
    </TodosContext.Provider>
  );
};
