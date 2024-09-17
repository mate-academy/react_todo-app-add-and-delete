/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, postTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './TodoList';
import classNames from 'classnames';
import { Header } from './Header';
import { Footer } from './Footer';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtered, setFiltered] = useState('all');
  const [titleTodo, setTitleTodo] = useState('');
  const [inputTodo, setInputTodo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (inputFocus.current && inputTodo) {
      inputFocus.current.focus();
    }
  }, [inputTodo]);

  const filteredTodos = todos.filter(todo => {
    if (filtered === 'active') {
      return !todo.completed;
    }

    if (filtered === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const todosCounter = todos.filter(todo => !todo.completed).length;

  function deletePost(todoId: number) {
    setInputTodo(false);
    setIsLoading(true);
    deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setInputTodo(true);
        setIsLoading(false);
      });
  }

  function addTodo({ userId, title, completed }: Todo) {
    postTodos({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleTodo('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setInputTodo(true);
        setTempTodo(null);
      });
  }

  const HandleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    setInputTodo(false);

    addTodo(newTempTodo);
  };

  const HandleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const HandleErrorClose = () => {
    setErrorMessage('');
  };

  const HandleClearCompleted = () => {
    todos.map(todo => {
      if (todo.completed === true) {
        deletePost(todo.id);
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
          HandleSubmit={HandleSubmit}
          titleTodo={titleTodo}
          HandleTitle={HandleTitle}
          inputFocus={inputFocus}
          inputTodo={inputTodo}
        />

        <TodoList
          isLoading={isLoading}
          tempTodo={tempTodo}
          onDelete={deletePost}
          todos={filteredTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            todosCounter={todosCounter}
            filtered={filtered}
            setFiltered={setFiltered}
            HandleClearCompleted={HandleClearCompleted}
            todos={todos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          onClick={HandleErrorClose}
          type="button"
          className="delete"
        />
        {errorMessage}
      </div>
    </div>
  );
};
