import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Filters } from './types/Filters';

const USER_ID = 10586;

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [selected, setSelected] = useState<string>(Filters.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isEmptyTitle, setEmptyTitle] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disableInput, setDisableInput] = useState<boolean>(false);
  const [unableToAdd, setUnableToAdd] = useState<boolean>(false);
  const [showClearCompleted, setShowClearCompleted] = useState<boolean>(false);
  const [unableToRemove, setUnableToRemove] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<number | boolean>();

  const showBtnClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        setShowClearCompleted(true);
      }
    });
  };

  useEffect(() => {
    showBtnClearCompleted();
  }, [todos]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  });

  const filterTodo = useCallback(() => {
    switch (selected) {
      case Filters.All:

        return todos;

      case Filters.Active:
        return todos.filter(todo => !todo.completed);

      case Filters.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [selected, todos]);

  const loadTodos = async () => {
    try {
      setError(null);

      const data = await getTodos(USER_ID);

      if ('Error' in data) {
        throw new Error('Error - impossible load todo');
      } else {
        setTodos(data);
      }
    } catch {
      setError(new Error('Error 404 no connection to the server'));

      throw new Error('Error 404 no connection to the server');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async () => {
    if (!query) {
      setEmptyTitle(true);
      setError(new Error('imposible add todo with empty value'));

      return;
    }

    const newTodo = {
      title: query,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    setDisableInput(true);
    try {
      const todo = await postTodo(newTodo);

      setTodos(prevTodo => ([...prevTodo, todo]));
      setQuery('');
    } catch {
      setError(new Error('Error 404 no connection to the server'));
      setUnableToAdd(true);
    } finally {
      setTempTodo(null);
      setDisableInput(false);
    }
  };

  const visibleTodos = filterTodo();

  const revomeTodo = async (todoId = 0) => {
    setShowLoading(todoId);

    try {
      await deleteTodo(todoId);

      setTodos((prevTodo) => prevTodo.filter(prev => prev.id !== todoId));
    } catch {
      setUnableToRemove(true);
      setError(new Error('Error 404 no connection to the server'));
    } finally {
      setShowLoading(false);
    }
  };

  const removeCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        revomeTodo(todo.id);
        setShowClearCompleted(false);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={setQuery}
          onAdd={addTodo}
          IsDisabled={disableInput}
        />

        {todos?.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onRemove={revomeTodo}
              showLoading={showLoading}
            />
            <Footer
              todoCount={visibleTodos.length}
              selectTodo={setSelected}
              selected={selected}
              onRemoveCompleted={removeCompleted}
              isClearCopleted={showClearCompleted}
            />
          </>
        )}
        {error && (
          <Notification
            isEmptyTitle={isEmptyTitle}
            setShowError={setError}
            ShowError={error}
            isUnableToAdd={unableToAdd}
            isUnableToRemove={unableToRemove}
          />
        )}
      </div>
    </div>
  );
};
