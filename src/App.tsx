/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

function getVisibleTodos(todos: Todo[], selectedFilter: Filter) {
  switch (selectedFilter) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [responseError, setResponseError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setResponseError('Unable to load todos'));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponseError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [responseError]);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, selectedFilter),
    [todos, selectedFilter],
  );
  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const handleAddTodo = (title: string) => {
    setResponseError('');
    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    return addTodo(title, USER_ID, false)
      .then(newTodo => setTodos(current => [...current, newTodo]))
      .catch(() => {
        setResponseError('Unable to add a todo');
        throw new Error();
      })
      .finally(() => setTempTodo(null));
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingIds(current => [...current, id]);

    deleteTodo(id)
      .then(() => setTodos(current => current.filter(todo => todo.id !== id)))
      .catch(() => setResponseError('Unable to delete a todo'))
      .finally(() => {
        setLoadingIds(current => current.filter(loadingId => loadingId !== id));
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const hasCompleted = todos.some(todo => todo.completed);
  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todoDelete => handleDeleteTodo(todoDelete.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onError={setResponseError}
          onAdd={handleAddTodo}
          isSubmitting={tempTodo !== null}
          inputRef={inputRef}
        />
        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          onDelete={handleDeleteTodo}
        />
        {todos.length > 0 && (
          <>
            {/* Hide the footer if there are no todos */}
            <Footer
              activeTodosCount={activeTodosCount}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              hasCompleted={hasCompleted}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        responseError={responseError}
        onClose={() => setResponseError('')}
      />
    </div>
  );
};

// Title should not be empty
// <br />
// Unable to add a todo
// <br />
// Unable to delete a todo
// <br />
// Unable to update a todo
