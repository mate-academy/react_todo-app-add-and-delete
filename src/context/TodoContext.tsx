import { createContext, ReactNode, useMemo, RefObject } from 'react';
import { TodoErrors } from '../utils/enums/TodoErrors';
import { Todo } from '../types/Todo';
import { useTodoInput } from '../hooks/useTodoInput';
import { useTodoErrors } from '../hooks/useTodoErrors';
import { useTodos } from '../hooks/useTodos';

interface ITodosContext {
  todos: Todo[];
  error: TodoErrors | null;
  tempTodo: Todo | null;
  inputRef: RefObject<HTMLInputElement> | null;

  onFocus: () => void;
  fetchTodos: () => void;
  addTodo: (title: string) => Promise<Todo | void>;
  deleteTodo: (todoId: number) => Promise<number | void>;
  deleteCompletedTodos: () => Promise<void>;
  showError: (err: TodoErrors) => void;
}

export const TodosContext = createContext<ITodosContext>({
  todos: [],
  error: null,
  tempTodo: null,
  inputRef: null,

  fetchTodos: () => {},
  addTodo: async () => Promise.resolve(),
  deleteTodo: async () => Promise.resolve(),
  deleteCompletedTodos: async () => Promise.resolve(),
  showError: () => {},
  onFocus: () => {},
});

export const TodosProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const { error, showError } = useTodoErrors();
  const { inputRef, onFocus } = useTodoInput();
  const {
    todos,
    fetchTodos,
    addTodo,
    deleteTodo,
    deleteCompletedTodos,
    tempTodo,
  } = useTodos(showError);

  const store = useMemo(
    () => ({
      todos,
      tempTodo,
      error,
      inputRef,

      fetchTodos,
      addTodo,
      deleteTodo,
      showError,
      deleteCompletedTodos,
      onFocus,
    }),
    [todos, error, tempTodo, inputRef],
  );

  return (
    <TodosContext.Provider value={store}>{children}</TodosContext.Provider>
  );
};
