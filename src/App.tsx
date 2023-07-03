/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { showError } from './helpers/helpers';
import { Error } from './components/Error';
import { Footer, FilterStatus } from './components/Footer';
import { Todos } from './components/Todos';
import { Header } from './components/Header';

const USER_ID = 10881;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  const [loader, setLoader] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => (showError('Failed to get list of todos', setError)));
  }, []);

  let visibleTodos = todos;

  switch (filter) {
    case FilterStatus.COMPLETED:
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;

    case FilterStatus.ACTIVE:
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;

    default:
      break;
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          setError={setError}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
        />

        <Todos
          todos={visibleTodos}
          tempTodo={tempTodo}
          setError={setError}
          setTodos={setTodos}
          loader={loader}
          setLoader={setLoader}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            setTodos={setTodos}
            setError={setError}
            setLoader={setLoader}
          />
        )}

      </div>
      <Error error={error} setError={setError} />
    </div>
  );
};
