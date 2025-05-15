/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */

// #region Components

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { MessageError } from './components/MessageError';

// #endregion

// #region allImport

import { Todo } from './types/Todo';
import { getTodos, postTodos, deleteTodos } from './api/todos';
import React, { useEffect, useRef, useState } from 'react';

// #endregion

export type TypeNewTodo = {
  id: null;
  userId: number;
  title: string;
  completed: boolean;
};

const USER_ID = 2881;

export const App: React.FC = () => {
  // #region AddFocus
  const inputRef = useRef<HTMLInputElement>(null);
  const useRefTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focusForInput = () => {
    inputRef.current?.focus();
  };
  // #endregion

  // #region AddLoader
  const [LoderId, setLoderId] = useState<number | null>(null);

  const showLoader = (id: number) => {
    setLoderId(id);
  };
  // #endregion

  // #region State

  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [theError, setTheError] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [NewTodo, setCreateNewTodo] = useState<TypeNewTodo | null>(null);
  const [doDisable, setDoDisable] = useState(false);

  // #endregion

  // #region showErro

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (message: string) => {
    setHasError(true);
    setTheError(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setHasError(false);
    }, 3000);
  };

  // #endregion

  // #region DoFetch

  const doPost = (titleValue: string) => {
    if (titleValue.trim().length === 0) {
      showError('Title should not be empty');

      return;
    }

    const createNewTodo: TypeNewTodo = {
      id: null,
      userId: USER_ID,
      title: titleValue.trim(),
      completed: false,
    };

    setCreateNewTodo(createNewTodo);
    setDoDisable(true);

    postTodos(createNewTodo)
      .then(response => {
        setTodos(prev => [...prev, response]);
        setInputValue('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setCreateNewTodo(null);
        setDoDisable(false);

        // #region AddFocus
        if (useRefTimer.current) {
          clearTimeout(useRefTimer.current);
        }

        useRefTimer.current = setTimeout(() => {
          focusForInput();
        }, 0);
        // #endregion AddFocus
      });
  };

  const deletePost = (id: number) => {
    deleteTodos(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => focusForInput());
  };

  // #endregion

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          doPost={doPost}
          doDisable={doDisable}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        <TodoList
          LoderId={LoderId}
          todos={todos}
          showLoader={showLoader}
          NewTodo={NewTodo}
          deletePost={deletePost}
          visibleTodos={visibleTodos}
        />

        <Footer setFilter={setFilter} filter={filter} todos={todos} />
      </div>

      <MessageError
        setHasError={setHasError}
        hasError={hasError}
        theError={theError}
      />
    </div>
  );
};
