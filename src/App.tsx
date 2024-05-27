/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';

import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilteredTodos } from './filters/filteredTodos';
import { TodoItem } from './components/TodoItem/TodoItem';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState(Status.All);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(Error.UnableLoad));
  }, []);

  const filteredTodos = FilteredTodos(todos, filter);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          deleteIds={deleteIds}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          setError={setError}
        />
        <TodoList
          todos={filteredTodos}
          deleteIds={deleteIds}
          setTodos={setTodos}
          setError={setError}
          setDeleteIds={setDeleteIds}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isTemp={true}
            deleteIds={deleteIds}
            setTodos={setTodos}
            setError={setError}
            setDeleteIds={setDeleteIds}
          />
        )}

        {!!todos.length && (
          <Footer
            todos={todos}
            selectedFilter={filter}
            setSelectedFilter={setFilter}
            setTodos={setTodos}
            setError={setError}
            setDeleteIds={setDeleteIds}
          />
        )}
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};
