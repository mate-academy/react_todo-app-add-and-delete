import React, { useEffect, useMemo } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './component/Header';
import { Footer } from './component/Footer';
import { TodoList } from './component/TodoList';
import { ErrorNotification } from './component/ErrorNotification';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterParams } from './types/FilterParams';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [filter, setFilter] = React.useState<FilterParams>(FilterParams.ALL);
  const [error, setError] = React.useState<ErrorMessages | null>(null);
  const [idsLoading, setIdsLoading] = React.useState<number[]>([]);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);

  const isAllCompleted = todos.every(todo => todo.completed);
  const isAnyCompleted = todos.some(todo => todo.completed);
  const notCompletedCount = isAllCompleted
    ? 0
    : todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    todoService
      .getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setError(ErrorMessages.UNABLE_TO_LOAD_TODOS));
  }, []);

  const handleErrorClose = () => setError(null);

  const handleDeletingTodo = (todoId: number) => {
    setIdsLoading(prevIds => [...prevIds, todoId]);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setError(ErrorMessages.UNABLE_TO_DELETE_TODOS))
      .finally(() => setIdsLoading([]));
  };

  const visibleTodos = useMemo(() => {
    if (filter === FilterParams.ALL) {
      return todos;
    }

    return todos.filter(todo =>
      filter === FilterParams.ACTIVE ? !todo.completed : todo.completed,
    );
  }, [todos, filter]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleClearCompleted = () => {
    const allCompleted = todos.filter(todo => todo.completed);

    const toDeleteList = allCompleted.map(todo => todo.id);

    toDeleteList.forEach(id => {
      handleDeletingTodo(id);
    });
  };

  const handleAddingTodo = async (value: string): Promise<void> => {
    if (!value) {
      setError(ErrorMessages.TITLE_ERROR);
      throw new Error();
    }

    try {
      setTempTodo({
        id: 0,
        userId: 0,
        title: value,
        completed: false,
      });

      const todo = await todoService.addTodo(value);

      setTodos(prev => [...prev, todo]);
    } catch {
      setError(ErrorMessages.UNABLE_TO_ADD_TODOS);
      throw new Error();
    } finally {
      setTempTodo(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          onAddingTodo={handleAddingTodo}
          todosCount={todos.length}
        />
        <TodoList
          todos={visibleTodos}
          onDelete={handleDeletingTodo}
          idsToDelete={idsLoading}
          tempTodo={tempTodo}
        />
        {todos.length > 0 && (
          <Footer
            isAnyCompleted={isAnyCompleted}
            notCompletedCount={notCompletedCount}
            selectedFilter={filter}
            onFilterChange={setFilter}
            onCompletedClear={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification onErrorClose={handleErrorClose} error={error} />
    </div>
  );
};
