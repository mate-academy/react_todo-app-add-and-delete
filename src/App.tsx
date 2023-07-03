/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
// import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ErrorType, FilterType, TodosInfo } from './types/HelperTypes';
import { ErrorMessage } from './components/ErrorMessage';
import { getFilteredTodos, getTodosInfo } from './Helper';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';

const USER_ID = 10923;

const initialTodosInfo: TodosInfo = {
  length: 0,
  countOfActive: 0,
  someCompleted: false,
};

const initialTodo: Todo = {
  id: 0,
  userId: USER_ID,
  completed: false,
  title: '',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [todosInfo, setTodosInfo] = useState<TodosInfo>(initialTodosInfo);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const loadTodos = async () => {
    setErrorType(null);

    try {
      const loadedTodos: Todo[] = await getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch {
      setErrorType(ErrorType.DATALOADING);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos: Todo[] = useMemo(() => {
    const filteredTodos = getFilteredTodos(todos, filterType);

    setTodosInfo(getTodosInfo(todos));

    return filteredTodos;
  }, [todos, filterType]);

  const addTodo = useCallback(async (title: string) => {
    try {
      setTempTodo({
        ...initialTodo,
        title,
      });

      const newTodo: Todo = await postTodo(title);

      setTodos((prewTodos) => [
        ...prewTodos,
        newTodo,
      ]);
    } catch {
      setErrorType(ErrorType.ADD_UNABLE);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    try {
      const removedTodo = await deleteTodo(id);

      if (removedTodo) {
        setTodos((prewTodos) => prewTodos.filter(todo => todo.id !== id));
      }
    } catch {
      setErrorType(ErrorType.DELETE_UNABLE);
    }
  }, []);

  const removeCompletedTodos = () => {
    try {
      todos
        .filter(todo => todo.completed)
        .map(async (completedTodo) => {
          await removeTodo(completedTodo.id);
        });
    } catch {
      setErrorType(ErrorType.DELETE_UNABLE);
    }
  };

  const handleFilterType = (type: FilterType): void => {
    setFilterType(type as FilterType);
  };

  const removeError = () => {
    setErrorType(null);
  };

  const errorMessage = useMemo(() => {
    const timerId = setTimeout(() => {
      setErrorType(null);
      clearTimeout(timerId);
    }, 3000);

    switch (errorType) {
      case ErrorType.DATALOADING:
        return 'Error loading data';
      case ErrorType.EMPTY_FIELD:
        return 'Title can\'t be empty';
      case ErrorType.ADD_UNABLE:
        return 'Unable to add a todo';
      case ErrorType.DELETE_UNABLE:
        return 'Unable to delete a todo';
      default:
        return null;
    }
  }, [errorType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          countOfActive={todosInfo.countOfActive}
          addTodo={addTodo}
          setErrorType={setErrorType}
        />

        {todosInfo.length !== 0
          && (
            <TodoList
              todos={visibleTodos}
              removeTodo={removeTodo}
              tempTodo={tempTodo}
            />
          )}

        {todosInfo.length !== 0 && (
          <Footer
            filterType={filterType}
            handleFilterType={handleFilterType}
            someCompleted={todosInfo.someCompleted}
            countOfActive={todosInfo.countOfActive}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      {errorMessage
        && (
          <ErrorMessage
            errorMessage={errorMessage}
            removeError={removeError}
          />
        )}
    </div>
  );
};
