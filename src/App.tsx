import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorType } from './types/ErrorTypes';
import { Filter } from './types/Filter';
import { Header } from './components/Header';

export function getFilteredTodos(
  currentTodos: Todo[],
  currentFilter: Filter,
): Todo[] {
  switch (currentFilter) {
    case Filter.Active:
      return currentTodos.filter(todo => !todo.completed);
    case Filter.Completed:
      return currentTodos.filter(todo => todo.completed);
    case Filter.All:
    default:
      return currentTodos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | ''>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);

  useEffect(() => {
    setIsLoading(true);
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.Load);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setError(ErrorType.EmptyTitle);

      return;
    }

    setError('');

    try {
      const newTodo = await todoService.addTodo(title.trim());

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      setError(ErrorType.Add);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const updatedTodo = await todoService.updateCompleted(
        todo.id,
        !todo.completed,
      );

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setError(ErrorType.Update);
    }
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getFilteredTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={handleAddTodo}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
        />
        <TodoList
          todos={visibleTodos}
          toggleTodo={toggleTodo}
          isLoading={isLoading}
        />
        {todos.length !== 0 && (
          <Footer
            itemsLeft={todos.filter(todo => !todo.completed).length}
            hasCompleted={todos.some(todo => todo.completed)}
            currentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={() =>
              setTodos(currentTodos =>
                currentTodos.filter(todo => !todo.completed),
              )
            }
          />
        )}
      </div>

      <ErrorNotification errorMessage={error} onClose={() => setError('')} />
    </div>
  );
};
