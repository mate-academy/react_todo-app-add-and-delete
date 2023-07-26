/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Todo } from './services/types';
import { Filter } from './services/enums';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

const USER_ID = 11138;

interface FilterParams {
  filterBy?: Filter,
}

function filterTodosByCompleted(todos: Todo[], filter: Filter): Todo[] {
  let todosCopy = [...todos];

  switch (filter) {
    case (Filter.ACTIVE): {
      todosCopy = todosCopy.filter(todo => !todo.completed);
      break;
    }

    case (Filter.COMPLETED): {
      todosCopy = todosCopy.filter(todo => todo.completed);
      break;
    }

    default: {
      break;
    }
  }

  return todosCopy;
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
  todoAdd: (newQuery: string) => Promise<boolean>,
  handleAllCompletedToggle: (isAllActive: boolean) => void,
  clearAllCompleted: () => void,
  todoChange: (newTodo: Todo) => Promise<boolean>,
  todoDelete: (todoId: number) => Promise<boolean>,
  isTodosHasCompleted: () => boolean,
  isEveryTodoCompleted: () => boolean,
  filterBy: Filter,
  setFilterBy: (newFilter: Filter) => void,
  errorMessage: string,
  areCompletedDeletingNow: boolean,
  tempTodo: Todo | null,
  setTempTodo: (newTodo: Todo | null) => void,
}

export const TodosContext = React.createContext<ContextProps>({
  todos: [],
  visibleTodos: [],
  todoAdd: () => new Promise<boolean>(() => {}),
  handleAllCompletedToggle: () => {},
  clearAllCompleted: () => {},
  todoChange: () => new Promise<boolean>(() => {}),
  todoDelete: () => new Promise<boolean>(() => {}),
  isTodosHasCompleted: () => false,
  isEveryTodoCompleted: () => false,
  filterBy: Filter.ALL,
  setFilterBy: () => {},
  errorMessage: '',
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

  const visibleTodos = filterTodos(todos, { filterBy });

  useEffect(() => {
    getTodos(USER_ID).then(setTodos);
  }, [todos]);

  const handleErrorOccuring = (errorTitle: string) => {
    setErrorMessage(errorTitle);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const todoAdd = (newQuery: string) => {
    const normalizedQuery = newQuery.trim();

    return new Promise<boolean>((resolve, reject) => {
      if (!normalizedQuery) {
        handleErrorOccuring('Title can\'t be empty');
        reject(new Error(errorMessage));

        return;
      }

      const newTodo: Omit<Todo, 'id'> = {
        title: normalizedQuery,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      addTodo({ userId: USER_ID, ...newTodo })
        .then(() => resolve(true))
        .catch(() => {
          handleErrorOccuring('Unable to add a todo');
          reject(new Error(errorMessage));
        });
    })
      .catch(error => error);
  };

  const handleAllCompletedToggle = (isAllCompleted: boolean) => {
    const newTodos = [...todos].map(todo => {
      return {
        ...todo,
        completed: isAllCompleted,
      };
    });

    setTodos(newTodos);
  };

  const todoDelete = (todoId: number) => {
    return new Promise<boolean>((resolve, reject) => {
      deleteTodo(todoId)
        .then(() => resolve(true))
        .catch(() => {
          handleErrorOccuring('Unable to delete a todo');
          reject(new Error(errorMessage));
        });
    })
      .catch(error => error);
  };

  const clearAllCompleted = () => {
    const todosIdsToOperate = [...todos]
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setAreCompletedDeletingNow(true);

    deleteAllTodos(todosIdsToOperate)
      .then(() => setAreCompletedDeletingNow(false));
  };

  const todoChange = (newTodo: Todo) => {
    return new Promise<boolean>((resolve, reject) => {
      updateTodo({ userId: USER_ID, ...newTodo })
        .then(() => resolve(true))
        .catch(() => {
          handleErrorOccuring('Unable to change todo');
          reject(new Error(errorMessage));
        });
    })
      .catch(error => error);
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
    handleAllCompletedToggle,
    clearAllCompleted,
    todoChange,
    todoDelete,
    isTodosHasCompleted,
    isEveryTodoCompleted,
    filterBy,
    setFilterBy,
    errorMessage,
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
