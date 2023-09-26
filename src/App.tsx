/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList/TodosList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Loader } from './components/Loader';

import * as todoService from './api/todos';
import { ERROR_MESSAGES } from './utils/constants/ERROR_MESSAGES';
import { getFilteredTodos } from './utils/helpers/getFilteredTodos';
import { SortType } from './types/SortType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectFilter, setSelectFilter] = useState(SortType.All);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const [isProsessingTodoIds, setIsProsessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // eslint-disable-next-line no-console
  console.log(isProsessingTodoIds);

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.unableToLoadTodos);
        // throw new Error(ERROR_MESSAGES.unableToLoadTodos);
      })
      .finally(() => {
        setLoadingTodos(false);

        textInputRef.current?.removeAttribute('disabled');
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      });
  }, []);

  useEffect(() => {
    let timerError: NodeJS.Timeout | undefined;

    if (errorMessage) {
      timerError = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timerError);
    };
  }, [errorMessage]);

  useEffect(() => {
    textInputRef.current?.removeAttribute('disabled');
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [todos]);

  const handleAddTodo = (todoTitle: string) => {
    setErrorMessage('');
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: 0,
      completed: false,
    });

    return todoService.addTodo(todoTitle)
      .then(todo => {
        setTodos((prevState) => {
          return [...prevState, todo];
        });
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.unableToAddTodo);
        throw new Error(ERROR_MESSAGES.unableToAddTodo);
      })
      .finally(() => {
        setTempTodo(null);

        textInputRef.current?.removeAttribute('disabled');
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setIsProsessingTodoIds((prevState) => {
      return [...prevState, todoId];
    });
    todoService.deleteTodos(todoId)
      .then(() => {
        setTodos(prevState => {
          return prevState.filter(({ id }) => id !== todoId);
        });
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.unableToDeleteTodo);
        // throw new Error(ERROR_MESSAGES.unableToDeleteTodo);
      })
      .finally(() => {
        setIsProsessingTodoIds((prevState) => {
          return prevState.filter(id => id !== todoId);
        });

        textInputRef.current?.removeAttribute('disabled');
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      });
  };

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    setErrorMessage('');
    setIsProsessingTodoIds((prevState) => {
      return [...prevState, todo.id];
    });

    todoService.updateTodo({
      id: todo.id,
      title: newTodoTitle,
      userId: todo.userId,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(oneTodo => {
          if (oneTodo.id !== updatedTodo.id) {
            return oneTodo;
          }

          return updatedTodo;
        }));
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.unableToUpdateTodo);
      })
      .finally(() => {
        setIsProsessingTodoIds((prevState) => {
          return prevState.filter(id => id !== todo.id);
        });
      });
  };

  const preparedTodos = useMemo(() => {
    return getFilteredTodos(todos, selectFilter);
  }, [todos, selectFilter]);

  const handleClearCopmpletedTodo = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          textInputRef={textInputRef}
          setErrorMessage={setErrorMessage}
          onTodoAdd={handleAddTodo}
        />
        {loadingTodos
          ? (<Loader />)
          : (
            <TodosList
              onTodoDelete={handleDeleteTodo}
              todos={preparedTodos}
              onTodoUpdate={handleUpdateTodo}
              isProcessing={isProsessingTodoIds}
              tempTodo={tempTodo}
            />
          )}

        {!!todos.length && (
          <Footer
            todos={todos}
            selectFilter={selectFilter}
            changeSelectFilter={setSelectFilter}
            handleClearCopmpletedTodo={handleClearCopmpletedTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
