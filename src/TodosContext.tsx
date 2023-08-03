/* eslint-disable no-console */
import React, { useEffect, useMemo, useState } from 'react';
import { Filter } from './services/enums';
import {
  addTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { Todo } from './types';
import { filterTodosByCompleted } from './utils/functions';

const USER_ID = 11138;

interface FilterParams {
  filterBy?: Filter,
}

function filterTodos(todos: Todo[], { filterBy }: FilterParams): Todo[] {
  let todosCopy = [...todos];

  if (filterBy) {
    todosCopy = filterTodosByCompleted(todos, filterBy);
  }

  return todosCopy;
}

function deleteAllTodos(todosIds: number[]): Promise<boolean> {
  return new Promise((resolve) => {
    todosIds.forEach(id => deleteTodo(id)
      .then(() => resolve(true)));
  });
}

interface ContextProps {
  todos: Todo[],
  visibleTodos: Todo[],
  todoAdd: (newQuery: string) => Promise<void>,
  clearAllCompleted: () => void,
  todoDelete: (todoId: number) => Promise<void>,
  isTodosHasCompleted: () => boolean,
  isEveryTodoCompleted: () => boolean,
  filterBy: Filter,
  setFilterBy: (newFilter: Filter) => void,
  errorMessage: string,
  setErrorMessage: (newError: string) => void,
  areCompletedDeletingNow: boolean,
  tempTodo: Todo | null,
  setTempTodo: (newTodo: Todo | null) => void,
}

export const TodosContext = React.createContext<ContextProps>({
  todos: [],
  visibleTodos: [],
  todoAdd: () => new Promise<void>(() => {}),
  clearAllCompleted: () => {},
  todoDelete: () => new Promise<void>(() => {}),
  isTodosHasCompleted: () => false,
  isEveryTodoCompleted: () => false,
  filterBy: Filter.ALL,
  setFilterBy: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  areCompletedDeletingNow: false,
  tempTodo: null,
  setTempTodo: () => {},
});

interface ProviderProps {
  children: React.ReactNode,
}

export const TodosProvider: React.FC<ProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.ALL);
  const [areCompletedDeletingNow, setAreCompletedDeletingNow]
    = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, { filterBy });
  }, [todos, filterBy]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(error => setErrorMessage(error));
  }, []);

  const todoAdd = (newQuery: string) => {
    const normalizedQuery = newQuery.trim();

    return new Promise<void>((resolve, reject) => {
      if (!normalizedQuery) {
        setErrorMessage('Title can\'t be empty');
        reject(new Error(errorMessage));

        return;
      }

      const newTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: normalizedQuery,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      addTodo(newTodo)
        .then((data) => {
          setTodos([...todos, data]);
          resolve();
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          reject(new Error(errorMessage));
        });
    });
  };

  const todoDelete = (todoId: number) => {
    return new Promise<void>((resolve, reject) => {
      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => {
            return todo.id !== todoId;
          }));

          resolve();
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          reject(new Error(errorMessage));
        });
    });
  };

  const clearAllCompleted = () => {
    const todosIdsToOperate = [...todos]
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setAreCompletedDeletingNow(true);

    deleteAllTodos(todosIdsToOperate)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => {
          return !todosIdsToOperate.includes(todo.id);
        }));
        setAreCompletedDeletingNow(false);
      });
  };

  const isTodosHasCompleted = () => {
    return todos.some(todo => todo.completed);
  };

  const isEveryTodoCompleted = () => {
    return todos.every(todo => todo.completed);
  };

  const value = {
    todos,
    visibleTodos,
    todoAdd,
    clearAllCompleted,
    todoDelete,
    isTodosHasCompleted,
    isEveryTodoCompleted,
    filterBy,
    setFilterBy,
    errorMessage,
    setErrorMessage,
    areCompletedDeletingNow,
    tempTodo,
    setTempTodo,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
