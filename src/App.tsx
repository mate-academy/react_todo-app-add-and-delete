/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deletePost, getTodos, USER_ID } from './api/todos';
// import { Button } from './components/Button/Button';
import { Todo } from './types/Todo';
// import { TodoItem } from './components/TodoItem/TodoItem';
import { TIMEOUT_CLEAR } from './constants/constants';
// import { Link } from './components/Link/Link';
// import classNames from 'classnames';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Staus } from './types/Starus';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

// type Staus = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusTodo, setStatusTodo] = useState<Staus>('All');
  const [deletedId, setDdeletedId] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [titleTodo, setTitleTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const refInputAdd = useRef<HTMLInputElement | null>(null);

  const loadingTodos = () => {
    setErrorMessage('');
    // setIsLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(new Error('Unable to load todos').message);
      });
    // .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadingTodos();
    refInputAdd.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage.trim()) {
      return;
    }

    const timeoutId = setTimeout(() => setErrorMessage(''), TIMEOUT_CLEAR);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  useEffect(() => {
    if (tempTodo === null) {
      refInputAdd.current?.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitleTodo(e.target.value);

  const setFilter = (filter: Staus) => setStatusTodo(filter);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(prevTodos => [...prevTodos, todoFromServer]);
        setTitleTodo('');
      })
      .catch(() => setErrorMessage(new Error('Unable to add a todo').message))
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setDdeletedId(prevIds => [...prevIds, id]);
    // deletePost(id)
    //   .then(() => {
    //     setTodos(prevTodos => [...prevTodos].filter(tod => tod.id !== id));

    //     return id;
    //   })
    //   .catch(() =>
    //     setErrorMessage(new Error('Unable to delete a todo').message),
    //   )
    //   .finally(() => setDdeletedId([]));

    // refInputAdd.current?.focus();
    return deletePost(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(tod => tod.id !== id));

        return id;
      })
      .catch(() => {
        setErrorMessage(new Error('Unable to delete a todo').message);
        throw new Error(`Unable to delete todo with id ${id}`);
      })
      .finally(() => {
        setDdeletedId([]);
        refInputAdd.current?.focus();
      });
  };

  const prepareTodos = (): Todo[] => {
    switch (statusTodo) {
      case 'Active':
        return todos.filter(todoItem => !todoItem.completed);
      case 'Completed':
        return todos.filter(todoItem => todoItem.completed);
      default:
        return todos;
    }
  };

  const deleteCompleted = () => {
    setDdeletedId(
      todos.reduce((acc: number[], todo) => {
        if (todo.completed) {
          const result = [...acc];

          result.push(todo.id);

          return result;
        } else {
          return acc;
        }
      }, []),
    );

    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => handleDelete(todo.id));

    Promise.allSettled(deletePromises)
      .then(data => {
        if (!data.some(todo => todo.status === 'fulfilled')) {
          throw new Error('Unable to delete a todo');
        }
      })
      .catch(error => setErrorMessage(error.message));

    // Promise.allSettled(deletePromises)
    //   .then(() => {
    //     setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    //   })
    //   .catch(() =>
    //     setErrorMessage(new Error('Unable to delete a todo').message),
    //   )
    //   .finally(() => setDdeletedId([]));
  };

  const onHideError = () => setErrorMessage('');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onChange={onChange}
          onSubmit={onSubmit}
          titleTodo={titleTodo}
          tempTodo={tempTodo}
          ref={refInputAdd}
        />

        <TodoList
          prepareTodos={prepareTodos}
          handleDelete={handleDelete}
          deletedId={deletedId}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            onClick={setFilter}
            statusTodo={statusTodo}
            deleteCompleted={deleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onHideError={onHideError}
      />
    </div>
  );
};
