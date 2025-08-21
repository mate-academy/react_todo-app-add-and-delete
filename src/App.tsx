/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { TodosList } from './components/TodosList/TodosList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Context } from './components/Context/Context';

export enum Filters {
  Completed,
  Active,
  All,
}

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [disableWritingInput, setDisableWritingInput] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo[] | null>(null);
  const [todosToDelete, setTodosToDelete] = useState<number[]>([]);
  const [filter, setFilter] = useState<Filters>(Filters.All);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisableWritingInput(true);
    const todo = {
      title: query.trim(),
      completed: false,
      userId: 3303,
    };

    setTempTodo([{ ...todo, id: 0 }]);

    if (query.trim().length === 0) {
      setError('Title should not be empty');
      setTempTodo(null);
      setDisableWritingInput(false);
    } else {
      postTodo(todo)
        .then(res => {
          setQuery('');
          setTempTodo(null);
          setTodos(prev => {
            if (prev === undefined) {
              return [res];
            } else {
              return [...prev, res];
            }
          });
        })
        .catch(() => {
          setTempTodo(null);
          setError('Unable to add a todo');
        })
        .finally(() => {
          setDisableWritingInput(false);
          inputRef.current?.focus();
        });
    }
  };

  const handleDelete = async (ids: number[]) => {
    setTodosToDelete(ids);
    const promises = ids.map(id => deleteTodo(id));
    const results = await Promise.allSettled(promises);

    const successfulIds: number[] = [];
    const failedIds: number[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulIds.push(ids[index]);
      } else {
        failedIds.push(ids[index]);
      }
    });

    if (failedIds.length > 0) {
      setError('Unable to delete a todo');
    }

    if (successfulIds.length > 0) {
      setTodos(prev => {
        if (prev === undefined) {
          return prev;
        } else {
          return prev.filter(todo => !successfulIds.includes(todo.id));
        }
      });
      setTodosToDelete([]);
      inputRef.current?.focus();
    }
  };

  const changeFilter = (name: Filters) => {
    setFilter(name);
  };

  const value = {
    filter,
    changeFilter,
  };

  const filteredTodos: Todo[] | undefined = useMemo(() => {
    if (todos) {
      switch (filter) {
        case Filters.Completed:
          return todos?.filter(todo => todo.completed);

        case Filters.Active:
          return todos?.filter(todo => !todo.completed);

        case Filters.All:
          return todos;
      }
    }

    return undefined;
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTodos()
      .then(resp => {
        setTodos(resp);
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={setQuery}
          handleSubmit={handleSubmit}
          disableInput={disableWritingInput}
          inputRef={inputRef}
        />

        <TodosList
          todos={filteredTodos}
          handleDelete={handleDelete}
          todosToDelete={todosToDelete}
        />
        <TodosList
          todos={tempTodo}
          handleDelete={handleDelete}
          todosToDelete={todosToDelete}
        />
        {/* Hide the footer if there are no todos */}

        {todos && todos?.length > 0 && (
          <Context.Provider value={value}>
            <Footer
              count={todos.filter(todo => !todo.completed).length}
              completed={todos.filter(todo => todo.completed)}
              handleDelete={handleDelete}
            />
          </Context.Provider>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        hidden={!!error}
        setError={async err => setError(err)}
        error={error}
      />
    </div>
  );
};
