/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TodoList } from './components/TodoList/TodoList';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer/Footer';

export enum FilterOptions {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const toggleTodoCompletion = useCallback((id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterOption) {
        case FilterOptions.Active:
          return !todo.completed;
        case FilterOptions.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filterOption]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true); // Блокируем поле ввода до завершения запроса

    const newTodo = {
      id: 0, // Временный ID для отображения в tempTodo
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo); // Устанавливаем tempTodo для отображения

    try {
      const createdTodo = await addTodo(newTodoTitle.trim());

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setNewTodoTitle('');
      setTempTodo(null); // Сбрасываем tempTodo после получения данных от API
      setError('');
    } catch {
      setError('Unable to add todo');
    } finally {
      setIsLoading(false); // Разблокируем поле ввода после завершения запроса
    }
  };

  const handleDelete = useCallback(async (todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, isLoading: true } : todo,
      ),
    );

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError("Can't delete todo");
    }
  }, []);

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    // Запускаем параллельные запросы на удаление завершенных задач
    try {
      await Promise.all(
        completedTodos.map(async todo => {
          await deleteTodo(todo.id);
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        }),
      );
    } catch {
      setError('Unable to delete some todos'); // Уведомление об ошибке
    }
  };

  const toggleAll = () => {
    const shouldCompleteAll = !allCompleted;

    setTodos(todos.map(todo => ({ ...todo, completed: shouldCompleteAll })));
  };

  useEffect(() => {
    const loadTodos = async () => {
      if (todos.length === 0) {
        setIsLoading(true);
        try {
          const todosFromApi = await getTodos();

          setTodos(todosFromApi.map(todo => ({ ...todo, isLoading: false })));
        } catch {
          setError('Unable to load todos');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTodos();
  }, [todos.length]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={toggleAll}
            aria-label="Toggle all todos"
          />

          <form onSubmit={handleAddTodo}>
            <input
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              aria-label="New todo title"
              autoFocus
              disabled={isLoading} // Отключить поле ввода в зависимости от состояния isLoading
            />
          </form>
        </header>

        {isLoading ? (
          <div data-cy="TodoLoader" className="spinner">
            Loading...
          </div>
        ) : (
          <>
            <TodoList
              todos={filteredTodos}
              onToggleTodo={toggleTodoCompletion}
              onDelete={handleDelete}
              tempTodo={tempTodo}
            />
            {todos.length > 0 && (
              <Footer
                todos={todos}
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                handleClearCompleted={handleClearCompleted}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
          aria-label="Close error notification"
        />
        {error}
      </div>
    </div>
  );
};
