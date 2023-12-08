import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import * as todoService from '../api/todos';

import { Error } from '../types/Error';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

interface TodosContextType {
  USER_ID: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo) => void,
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>,
  deleteTodo: (todoId: number) => void,
  isAdding: boolean,
  setIsAdding: (value: boolean) => void,
  idsToDelete: number[],
  setIdsToDelete: (value: number[]) => void,
  todoFilter: Status,
  setTodoFilter: (todoFilter: Status) => void,
  filteredTodos: Todo[],
  todoError: null | Error,
  setTodoError: (todoError: Error | null) => void,
}

const initialTodosContext: TodosContextType = {
  USER_ID: 12002,
  todos: [],
  setTodos: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  addTodo: async () => { },
  deleteTodo: async () => { },
  isAdding: false,
  setIsAdding: () => { },
  idsToDelete: [],
  setIdsToDelete: () => { },
  todoFilter: Status.All,
  setTodoFilter: () => { },
  filteredTodos: [],
  todoError: null,
  setTodoError: () => { },
};

export const TodosContext = React.createContext<TodosContextType>(
  initialTodosContext,
);

type Props = {
  children: React.ReactNode;
};

const USER_ID = 12002;

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoFilter, setTodoFilter] = useState<Status>(Status.All);
  const [todoError, setTodoError] = useState<Error | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

  const addTodo = useCallback(
    ({ title, userId, completed }: Omit<Todo, 'id'>) => {
      setTodoError(null);

      setTempTodo({
        id: 0,
        title,
        userId,
        completed,
      });

      setIsAdding(true);

      return todoService.createTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
        })
        .catch((error) => {
          setTodoError(Error.AddTodo);
          throw error;
        })
        .finally(() => {
          setTempTodo(null);
        });
    }, [],
  );

  const deleteTodo = useCallback((todoId: number) => {
    setTodoError(null);
    setIdsToDelete(prevIds => [...prevIds, todoId]);

    setTimeout(() => {
      setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoId)
      ));

      return (
        todoService.deleteTodo(todoId))
        .then(() => {
          setIdsToDelete([]);
        })
        .catch((error) => {
          setTodos(todos);
          setTodoError(Error.DeleteTodo);
          setIdsToDelete(prevIds => [...prevIds]
            .filter(prevId => prevId !== todoId));

          throw error;
        });
    }, 300);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (todoFilter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todoFilter, todos]);

  useEffect(() => {
    setTodoError(null);

    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setTodoError(Error.LoadTodos));
  }, []);

  const value = useMemo(() => ({
    USER_ID,
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    addTodo,
    deleteTodo,
    isAdding,
    setIsAdding,
    idsToDelete,
    setIdsToDelete,
    todoFilter,
    setTodoFilter,
    filteredTodos,
    todoError,
    setTodoError,
  }), [
    addTodo, deleteTodo, filteredTodos, isAdding,
    tempTodo, todoError, todoFilter, todos, idsToDelete,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
