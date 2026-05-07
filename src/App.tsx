/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Header } from './components/Header/Header';

export enum QueryTodos {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

function filterTodos(todos: Todo[], query: QueryTodos): Todo[] {
  return todos.filter(todo => {
    switch (query) {
      case QueryTodos.Active:
        return !todo.completed;
      case QueryTodos.Completed:
        return todo.completed;
      case QueryTodos.All:
      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [preparedTodos, setPreparedTodos] = useState<Todo[]>([]);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [titleTodo, setTitleTodo] = useState('');

  const [todoInputIsActive, setTodoInputIsActive] = useState(true);

  const activeTodosCount = filterTodos(todos, QueryTodos.Active).length;
  const completedTodos = filterTodos(todos, QueryTodos.Completed);

  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState<QueryTodos>(QueryTodos.All);

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        throw error;
      })
      .finally(() => setIsLoading(false));
  }

  function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    setErrorMessage('');
    setTodoInputIsActive(false);
    setTempTodo({ id: 0, title, userId, completed });

    return client
      .post<Todo>('/todos', { title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleTodo('');
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setTodoInputIsActive(true);
      });
  }

  useEffect(() => {
    if (todoInputIsActive) {
      inputRef.current?.focus();
    }
  }, [todoInputIsActive]);

  function deleteTodo(todoId: number) {
    setDeletingTodos(prev => [...prev, todoId]);

    return client
      .delete(`/todos/${todoId}`)
      .then(() => {
        inputRef.current?.focus();
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  }

  async function clearCompletedTodos() {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    await Promise.all(deletePromises);
    inputRef.current?.focus();
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    setPreparedTodos(filterTodos(todos, query));
  }, [query, todos]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setErrorMessage(''), 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const handleSubmit = (
    event: React.FormEvent,
    { title, userId, completed }: Omit<Todo, 'id'>,
  ) => {
    event.preventDefault();
    const fixedTitleTodo = title.trim();

    if (!fixedTitleTodo) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addTodo({ title: fixedTitleTodo, userId, completed });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          titleTodo={titleTodo}
          setTitleTodo={(value: string) => setTitleTodo(value)}
          handleSubmit={handleSubmit}
          todoInputIsActive={todoInputIsActive}
          inputRef={inputRef}
        />

        {!isLoading ? (
          <TodoList
            preparedTodos={preparedTodos}
            deleteTodo={deleteTodo}
            deletingTodos={deletingTodos}
            tempTodo={tempTodo}
          />
        ) : (
          <div className="todoapp__loader">
            <div className="loader"></div>
          </div>
        )}
        {!isLoading && todos.length !== 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodos={completedTodos}
            clearCompletedTodos={clearCompletedTodos}
            query={query}
            setQuery={(value: QueryTodos) => setQuery(value)}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={(value: string) => setErrorMessage(value)}
      />
    </div>
  );
};
