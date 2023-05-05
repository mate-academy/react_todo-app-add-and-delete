/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodoToServer, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/todoList';
import { TodoForm } from './components/todoForm';
import { TodoFooter } from './components/todoFooter';
import { Notification } from './components/notification';
import { FilterBy } from './types/FilterBy';

const USER_ID = 10221;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [title, setTitle] = useState<string | undefined>();
  const [todoWasDeleted, setTodoWasDeleted] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
        setTodoWasDeleted(false);
      })
      .catch((fetchedError) => {
        setError(
          fetchedError?.message
            ? fetchedError.message
            : 'Something went wrong',
        );

        setTodoWasDeleted(false);
      });
  }, [todoWasDeleted === true]);

  useEffect(() => {
    if (title) {
      addTodoToServer(USER_ID, {
        userId: USER_ID,
        title,
        completed: false,
      })
        .then((fetchedTodo: Todo) => {
          setTodos([...todos, fetchedTodo]);
          setTitle('');
        })
        .catch((fetchedError) => {
          setError(
            fetchedError?.message
              ? fetchedError.message
              : 'Something went wrong',
          );
        });
    }
  }, [title]);

  function getFilterCallback(filterType: FilterBy) {
    switch (filterType) {
      case FilterBy.ACTIVE:
        return (todo: Todo) => !todo.completed;

      case FilterBy.COMPLETED:
        return (todo: Todo) => todo.completed;

      default:
        return (todo: Todo) => !!todo.id;
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm addTodo={setTitle} />

        {todos.length ? (
          <>
            <TodoList
              todos={todos.filter(getFilterCallback(filterBy))}
              setError={setError}
              setTodoWasDeleted={setTodoWasDeleted}
            />
            <TodoFooter
              setFilterBy={setFilterBy}
              itemsQuantity={todos.filter(getFilterCallback(filterBy)).length}
            />
          </>
        ) : null}
      </div>

      <Notification
        onClose={(value: string | null) => setError(value)}
        error={error}
      />
    </div>
  );
};
