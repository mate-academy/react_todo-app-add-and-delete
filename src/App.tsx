/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoId, setProcessingTodoId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTodo.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const temp: Todo = {
      id: -Date.now(),
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [
        ...prev,
        ...(Array.isArray(created) ? created : [created]),
      ]);
      setNewTodo('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setProcessingTodoId(todoId);
    setIsLoading(true);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setProcessingTodoId(null);
    }
  };

  const handleClearCompleted = async () => {
    setIsLoading(true);
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfullyDeletedIds = completedTodos
      .map((todo, i) => (results[i].status === 'fulfilled' ? todo.id : null))
      .filter((id): id is number => id !== null);

    setTodos(prev =>
      prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    const hasError = results.some(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      results => results.status === 'rejected',
    );

    if (hasError) {
      setError('Unable to delete a todo');
    }

    setIsLoading(false);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.active) {
      return !todo.completed;
    }

    if (filter === Filter.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          isLoading={isLoading}
          newTodo={newTodo}
          inputRef={inputRef}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processingTodoId={processingTodoId}
          onDelete={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
