import { FC, FormEvent, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterStatusEnum } from './types/Status.enum';
import { ErrorsEnum } from './types/Error.enum';
import { filterTodos } from './utils/filterTodos';
import { createTodo, getTodos, removeTodo, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';

export const App: FC = () => {
  const [filterStatus, setFilterStatus] = useState(FilterStatusEnum.All);
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorsEnum | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const filteredTodos = filterTodos(todos, filterStatus);
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const todosCount = todos.length;

  const loadTodos = async () => {
    try {
      const responseTodos = await getTodos();

      setTodos(responseTodos);
    } catch {
      setError(ErrorsEnum.LoadTodos);
    }
  };

  const addTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError(ErrorsEnum.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedQuery,
      userId: USER_ID,
      completed: false,
    } as Todo);

    try {
      setIsLoading(true);
      const responseTodo = await createTodo({
        userId: USER_ID,
        title: trimmedQuery,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, responseTodo]);
      setQuery('');
    } catch {
      setQuery(query);
      setError(ErrorsEnum.AddTodo);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const deleteTodos = async (todosIds: number[]) => {
    if (todosIds.length === 0) {
      return;
    }

    setLoadingIds(prev => [...prev, ...todosIds]);

    try {
      const results = await Promise.allSettled(
        todosIds.map(todoId => removeTodo(todoId)),
      );

      const successfullyDeletedIds: number[] = [];
      const failedIds: number[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfullyDeletedIds.push(todosIds[index]);
        } else {
          failedIds.push(todosIds[index]);
        }
      });

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      if (failedIds.length > 0) {
        setError(ErrorsEnum.DeleteTodo);
      }
    } catch {
      setError(ErrorsEnum.DeleteTodo);
    } finally {
      setLoadingIds(prev => prev.filter(id => !todosIds.includes(id)));
    }
  };

  const clearCompletedTodos = async () => {
    const completedIds = completedTodos.map(todo => todo.id);

    await deleteTodos(completedIds);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          onQueryChange={setQuery}
          addTodo={addTodo}
          isLoading={isLoading}
          loadingIds={loadingIds}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodos={deleteTodos}
          loadingIds={loadingIds}
          isLoading={isLoading}
        />

        {todosCount > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodos={completedTodos}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <Notification error={error} onSetError={setError} />
    </div>
  );
};
