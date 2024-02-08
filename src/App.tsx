/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { prepareTodos } from './services/prepareTodos';
import { wait } from './utils/fetchClient';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { USER_ID } from './constants/user';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterField, setFilterField] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingPostsIds, setDeletingPostsIds] = useState<number[]>([]);

  const filteredTodos = prepareTodos(todos, filterField);
  const activeTodosAmount = todos.reduce((acc, cur) => {
    if (!cur.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      wait(3000).then(() => {
        setErrorMessage('');
      });
    }
  }, [errorMessage]);

  const addTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => (
      prevTodos.filter(todo => todo.id !== id)
    ));
  };

  const handleErrorClose = () => {
    setErrorMessage('');
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleSetTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const handleFilterField = (status: Status) => {
    setFilterField(status);
  };

  const handleDeletingPostsIds = (id: number | null) => {
    if (id) {
      setDeletingPostsIds(prevPostsIds => [...prevPostsIds, id]);
    } else {
      setDeletingPostsIds([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onError={handleError}
          onSetTempTodo={handleSetTempTodo}
          onAddTodo={addTodo}
        />

        {(todos.length > 0 || !!tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onError={handleError}
            onDeleteTodo={deleteTodo}
            deletingPostsIds={deletingPostsIds}
            onAddDeletingPostsIds={handleDeletingPostsIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosAmount={activeTodosAmount}
            filterField={filterField}
            onFilter={handleFilterField}
            onError={handleError}
            todos={todos}
            onDeleteTodo={deleteTodo}
            onAddDeletingPostId={handleDeletingPostsIds}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onErrorClose={handleErrorClose}
      />
    </div>
  );
};
