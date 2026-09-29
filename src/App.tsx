// import { UserWarning } from './UserWarning';
// import { USER_ID } from './api/todos';
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as client from './api/todos';
import { Todo } from './types/Todo';

import { Filters } from './types/Filters';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoShowError } from './components/TodoShowError/TodoShowError';

export const App: React.FC = () => {
  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  const [error, setError] = useState<string>('');
  const [todos, setTodos] = useState<Todo[] | undefined>();
  const [query, setQuery] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'id'> | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filters>(Filters.ALL);
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    client
      .getTodos()
      .then(list => setTodos(list))
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredList = useMemo(() => {
    if (!todos) {
      return [];
    }

    return todos.filter(todo => {
      switch (currentFilter) {
        case Filters.ACTIVE:
          return !todo.completed;

        case Filters.COMPLETED:
          return todo.completed;

        case Filters.ALL:
        default:
          return true;
      }
    });
  }, [todos, currentFilter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          query={query}
          setQuery={setQuery}
          setTodos={setTodos}
          setError={setError}
          setTempTodo={setTempTodo}
          isFormDisabled={isFormDisabled}
          setIsFormDisabled={setIsFormDisabled}
          deletingTodoIds={deletingTodoIds}
        />

        {todos && todos.length > 0 && (
          <TodoList
            filteredList={filteredList}
            setTodos={setTodos}
            tempTodo={tempTodo}
            setError={setError}
            deletingTodoIds={deletingTodoIds}
            setDeletingTodoIds={setDeletingTodoIds}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos && todos.length > 0 && (
          <TodoFooter
            todos={todos}
            setTodos={setTodos}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            setDeletingTodoIds={setDeletingTodoIds}
            setError={setError}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <TodoShowError error={error} setError={setError} />
    </div>
  );
};
