/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { Status } from './types/Status';
import { USER_ID } from './utils/USER_ID';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [isDisabled, setIsDisabled] = useState(false);
  const [temptTodo, setTemptTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState<string>('');

  const closeError = useCallback(
    () => setError(null),
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  useEffect(() => {
    todosService.getTodos()
      .then(res => setTodos(res))
      .catch(() => setError(Error.UnableToLoadAll));
  }, []);

  const filterTodos = useCallback((currentTodos: Todo[], status: Status) => {
    return currentTodos.filter(todo => {
      switch (status) {
        case Status.All:
          return todo;
        case Status.Active:
          return !todo.completed;
        case Status.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, []);

  const filteredTodos = filterTodos(todos, filter);

  const isCompleted = !!todos.filter(todo => todo.completed === true).length;

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = event.target.value;

    setQuery(newTitle);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query || !query.trim()) {
      setError(Error.EmptyTitile);

      return;
    }

    if (query) {
      setIsDisabled(true);

      setTemptTodo({
        id: 0,
        title: '',
        completed: false,
      });
    }

    todosService.addTodo(query.trim())
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo] as Todo[]);
        setQuery('');
      })
      .catch(() => {
        setError(Error.UnableToAdd);
      })
      .finally(() => {
        setTemptTodo(null);
        setIsDisabled(false);
      });
  };

  const deleteTodo = (id: number) => {
    setTemptTodo({
      id: 0,
      title: '',
      completed: false,
    });

    todosService.deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(Error.UnableToDelete);
      })
      .finally(() => {
        setTemptTodo(null);
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
          handleSubmit={handleSubmit}
          isDisabled={isDisabled}
          query={query}
          handleInputChange={() => handleInputChange}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
              tempTodo={temptTodo}
              query={query}
            />

            <Footer
              filterTodos={setFilter}
              isCompleted={isCompleted}
              todos={filteredTodos}
              handleClearCompleted={handleClearCompleted}
              filter={filter}
            />
          </>
        )}
      </div>

      <ErrorMessage error={error} close={closeError} />
    </div>
  );
};
