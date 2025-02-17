import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import {
  ErrorNotification,
  Footer,
  Header,
  Navigation,
  TodoItem,
  TodoList,
} from './components';
import { Filter, Todo } from './types';

import React from 'react';
import { makeFilterTodos } from './utils/makeFilterTodos';

const NEW_TODO_DEFAULT_ID: Todo['id'] = 0;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>(Filter.all);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<Todo['id'][]>([]);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const todosFiltered = useMemo(
    () => makeFilterTodos(todos, activeFilter),
    [activeFilter, todos],
  );

  const handleFilterClick = useCallback(
    (filter: Filter) => setActiveFilter(filter),
    [],
  );

  const handleShowError = useCallback((err: string) => setError(err), []);
  const handleHideError = useCallback(() => setError(''), []);

  const handleAddLoadingId = (id: number) =>
    setLoadingIds(prev => [...prev, id]);

  const handleRemoveLoadingId = (id: number) =>
    setLoadingIds(prev => prev.filter(i => i !== id));

  const isLoading = useCallback(
    (id: Todo['id']) => loadingIds.includes(id),
    [loadingIds],
  );

  const handleAddTodo = useCallback(
    async (title: Todo['title']) => {
      try {
        handleAddLoadingId(NEW_TODO_DEFAULT_ID);

        const newTodo: Omit<Todo, 'id'> = {
          title,
          userId: USER_ID,
          completed: false,
        };

        setTempTodo({ ...newTodo, id: NEW_TODO_DEFAULT_ID });

        const createdTodo = await createTodo(newTodo);

        setTodos(prev => [...prev, createdTodo]);

        if (titleRef.current) {
          titleRef.current.value = '';
        }
      } catch (err) {
        handleShowError('Unable to add a todo');
      } finally {
        handleRemoveLoadingId(NEW_TODO_DEFAULT_ID);
        setTempTodo(null);
      }
    },
    [handleShowError],
  );

  const handleDeleteTodo = useCallback(
    async (id: Todo['id']) => {
      try {
        handleAddLoadingId(id);

        const deletedTodo = await deleteTodo(id);

        if (deletedTodo) {
          setTodos(prev => prev.filter(t => t.id !== id));
        }
      } catch (err) {
        handleShowError('Unable to delete a todo');
      } finally {
        handleRemoveLoadingId(id);
      }
    },
    [handleShowError],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading(NEW_TODO_DEFAULT_ID)}
          todos={todos}
          titleRef={titleRef}
          onShowError={handleShowError}
          onFormSubmit={handleAddTodo}
        />

        <TodoList>
          {todosFiltered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoading={isLoading(todo.id)}
              onDelete={handleDeleteTodo}
            />
          ))}

          {tempTodo ? (
            <TodoItem
              todo={tempTodo}
              isLoading={isLoading(NEW_TODO_DEFAULT_ID)}
            />
          ) : null}
        </TodoList>

        <Footer todos={todos} onDelete={handleDeleteTodo}>
          <Navigation
            activeFilter={activeFilter}
            onFilter={handleFilterClick}
          />
        </Footer>
      </div>

      <ErrorNotification error={error} onHideError={handleHideError} />
    </div>
  );
};
