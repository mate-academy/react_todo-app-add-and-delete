import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID, deleteTodo, getTodos, postTodo } from '../../api/todos';
import { TodoRequestBody } from '../../types/requestBodies';
import { FilterOption, TempTodo } from '../../types/types';
import { HandleCompletedTodosRemove } from '../../types/handlers';
import {
  ApiContextValue,
  ErrorContextValue,
  TodosContextValue,
} from '../../types/contextValues';

const TodosContext = React.createContext<TodosContextValue | null>(null);
const NewTodoInputContext = React.createContext<string | null>(null);
const FilterContext = React.createContext<FilterOption | null>(null);
const DeleteContext = React.createContext<number[] | null>(null);
const ErrorContext = React.createContext<ErrorContextValue | null>(null);
const TodoDependentApiContext =
  React.createContext<HandleCompletedTodosRemove | null>(null);
const ApiContext = React.createContext<ApiContextValue | null>(null);

type Props = React.PropsWithChildren;

let clearErrorTimeoutId = 0;
let clearErrorMessageTimeoutId = 0;

export const TodoProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterOption>('All');
  const [newTodoInput, setNewTodoInput] = useState('');
  const [tempTodo, setTempTodo] = useState<TempTodo>(null);
  const [idsOfTodosToDelete, setIdsOfTodosToDelete] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorShown, setErrorShown] = useState(false);

  const handleErrorClear = useCallback(() => {
    window.clearTimeout(clearErrorMessageTimeoutId);
    window.clearTimeout(clearErrorTimeoutId);
    setErrorShown(false);
    clearErrorMessageTimeoutId = window.setTimeout(() => {
      setErrorMessage('');
    }, 1000);
  }, []);

  const handleErrorSend = useCallback(
    (message: string) => {
      window.clearTimeout(clearErrorMessageTimeoutId);
      window.clearTimeout(clearErrorTimeoutId);
      setErrorMessage(message);
      setErrorShown(true);
      clearErrorTimeoutId = window.setTimeout(handleErrorClear, 3000);
    },
    [handleErrorClear],
  );

  const handleNewTodoInputChange = (title: string) => {
    setNewTodoInput(title);
  };

  const handleFilterChange = (newFilter: FilterOption) => {
    setFilter(newFilter);
  };

  const handleTodoAdd = useCallback(
    (title: string) => {
      const trimmedTitle = title.trim();

      if (trimmedTitle.length) {
        const todoRequestBody: TodoRequestBody = {
          userId: USER_ID,
          title: trimmedTitle,
          completed: false,
        };

        setTempTodo({
          ...todoRequestBody,
          id: 0,
        });

        postTodo({ ...todoRequestBody })
          .then(newTodo => {
            setTodos(prevTodos => [...prevTodos, newTodo]);
            handleNewTodoInputChange('');
          })
          .catch(() => handleErrorSend('Unable to add a todo'))
          .finally(() => setTempTodo(null));
      } else {
        handleErrorSend('Title should not be empty');
      }
    },
    [handleErrorSend],
  );

  const handleTodoRemove = useCallback(
    (id: number) => {
      setIdsOfTodosToDelete(prevIdsOfTodosToDelete => {
        return [...prevIdsOfTodosToDelete, id];
      });

      deleteTodo(id)
        .then(() => {
          setTodos(prevTodos => {
            return prevTodos.filter(todo => todo.id !== id);
          });
        })
        .catch(() => handleErrorSend('Unable to delete a todo'))
        .finally(() => {
          setIdsOfTodosToDelete(prevIdsOfTodosToDelete => {
            return prevIdsOfTodosToDelete.filter(
              idOfTodoToDelete => idOfTodoToDelete !== id,
            );
          });
        });
    },
    [handleErrorSend],
  );

  const handleCompletedTodosRemove = useCallback(() => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => handleTodoRemove(todo.id));
  }, [todos, handleTodoRemove]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleErrorSend('Unable to load todos'));
  }, [handleErrorSend]);

  const todosValue = useMemo(
    () => ({
      todos,
      tempTodo,
    }),
    [todos, tempTodo],
  );

  const errorValue = useMemo(
    () => ({
      errorMessage,
      errorShown,
    }),
    [errorMessage, errorShown],
  );

  const apiValue = useMemo(
    () => ({
      handleErrorClear,
      handleNewTodoInputChange,
      handleFilterChange,
      handleTodoAdd,
      handleTodoRemove,
    }),
    [handleErrorClear, handleTodoAdd, handleTodoRemove],
  );

  return (
    <ApiContext.Provider value={apiValue}>
      <TodoDependentApiContext.Provider value={handleCompletedTodosRemove}>
        <ErrorContext.Provider value={errorValue}>
          <DeleteContext.Provider value={idsOfTodosToDelete}>
            <FilterContext.Provider value={filter}>
              <NewTodoInputContext.Provider value={newTodoInput}>
                <TodosContext.Provider value={todosValue}>
                  {children}
                </TodosContext.Provider>
              </NewTodoInputContext.Provider>
            </FilterContext.Provider>
          </DeleteContext.Provider>
        </ErrorContext.Provider>
      </TodoDependentApiContext.Provider>
    </ApiContext.Provider>
  );
};

export const useTodoTodos = () => {
  const value = useContext(TodosContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoNewTodoInput = () => {
  const value = useContext(NewTodoInputContext);

  if (!value && value !== '') {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoFilter = () => {
  const value = useContext(FilterContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoDelete = () => {
  const value = useContext(DeleteContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoError = () => {
  const value = useContext(ErrorContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoTodoDependentApi = () => {
  const value = useContext(TodoDependentApiContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoApi = () => {
  const value = useContext(ApiContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};
