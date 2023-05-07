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
  const [title, setTitle] = useState<string | undefined>('');
  const [todoWasDeleted, setTodoWasDeleted] = useState(false);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);

  function getVisibleTodos(filterType: FilterBy) {
    switch (filterType) {
      case FilterBy.ACTIVE:
        setVisibleTodos(todos.filter((todo: Todo) => !todo.completed));
        break;

      case FilterBy.COMPLETED:
        setVisibleTodos(todos.filter((todo: Todo) => todo.completed));
        break;

      default:
        setVisibleTodos(todos);
    }
  }

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

  const onAddTodo = () => {
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
  };

  useEffect(() => getVisibleTodos(filterBy), [filterBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          setTitle={setTitle}
          title={title}
          onAdd={onAddTodo}
        />

        {todos.length ? (
          <>
            <TodoList
              todos={filterBy !== FilterBy.ALL ? visibleTodos : todos}
              setError={setError}
              setTodoWasDeleted={setTodoWasDeleted}
            />
            <TodoFooter
              setFilterBy={setFilterBy}
              itemsQuantity={filterBy !== FilterBy.ALL
                ? visibleTodos.length
                : todos.length}
              filterBy={filterBy}
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
