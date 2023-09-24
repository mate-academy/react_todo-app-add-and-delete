/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Todo } from './types/Todo';
import { createTodo, deleteTodos, getTodos } from './api/todos';
import { TodosList } from './components/TodosList/TodosList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { filteredTodos } from './helpers/filteredTodos';
import { SortType } from './types/SortType';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { ERROR_MESSAGES } from './utils/constants/ERROR_MESSAGES';
import { Loader } from './components/Loader';

const USER_ID = 11542;

const TODO_BLANK = {
  id: 0,
  userId: USER_ID,
  title: '',
  completed: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectFilter, setSelectFilter] = useState(SortType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo>(TODO_BLANK);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  // const [isLoadingTodo, setIsLoadingTodo] = useState(false);

  const deleteOneTodo = (todoId: number) => {
    deleteTodos(todoId)
      // eslint-disable-next-line no-console
      .then(r => console.log(r));
    setTodos((prevState) => prevState.filter(({ id }) => id !== todoId));
  };

  let timerError: NodeJS.Timeout | undefined;

  if (errorMessage) {
    timerError = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  const addTodo = useCallback((todo: Todo) => {
    if (newTodoTitle.trim()) {
      createTodo(todo)
        .then(newTodo => {
          setTodos((prevState) => {
            return [...prevState, newTodo];
          });
        });
    }

    return () => {
      clearTimeout(timerError);
    };
  }, [newTodoTitle, setTodos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((allTodos) => {
        setTodos(allTodos);
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      })
      .catch(() => setErrorMessage(ERROR_MESSAGES.unableToLoadTodos))
      .finally(() => {
        setIsLoadingTodos(false);
        setTempTodo(TODO_BLANK);
      });

    setIsLoadingTodos(true);
  }, []);

  useEffect(() => {
    setTempTodo(prevState => ({
      ...prevState,
      title: newTodoTitle,
    }));
  }, [newTodoTitle]);

  const preparedTodos = useMemo(() => {
    return filteredTodos(todos, selectFilter);
  }, [todos, selectFilter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          tempTodo={tempTodo}
          addTodo={addTodo}
          setNewTodoTitle={setNewTodoTitle}
          setErrorMessage={setErrorMessage}
          newTodoTitle={newTodoTitle}
          todos={todos}
          textInputRef={textInputRef}
        />
        {isLoadingTodos ? (
          <Loader />
        ) : (
          <TodosList
            deletePost={deleteOneTodo}
            todos={preparedTodos}
          />
        )}

        {todos.length > 0 && (
          <Footer
            selectFilter={selectFilter}
            setSelectFilter={setSelectFilter}
            todos={todos}
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
