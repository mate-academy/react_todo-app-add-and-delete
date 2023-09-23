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
  const [isLoadingTodo, setIsLoadingTodo] = useState(true);
  // eslint-disable-next-line no-console
  // console.log(tempTodo);

  const deleteOneTodo = (todoId: number) => {
    deleteTodos(todoId)
      // eslint-disable-next-line no-console
      .then(r => console.log(r));
    setTodos((prevState) => prevState.filter(({ id }) => id !== todoId));
  };

  const addTodo = useCallback((todo: Todo) => {
    if (newTodoTitle.trim()) {
      createTodo(todo)
        .then(newTodo => {
          setTodos((prevState) => {
            return [...prevState, newTodo];
          });
        });
    }
  }, [newTodoTitle, setTodos]);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ERROR_MESSAGES.unableToLoadTodos))
      .finally(() => {
        setIsLoadingTodo(false);
        setTempTodo(TODO_BLANK);
      });
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

  setTimeout(() => {
    setErrorMessage('');
  }, 3000);

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
        {isLoadingTodo ? (
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

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
