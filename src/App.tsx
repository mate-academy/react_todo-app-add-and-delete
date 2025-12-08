import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, deleteTodo, createTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoField.current?.focus();

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      setError('Title should not be empty');

      return;
    }

    const tempId = 0;

    const tempTodo: Todo = {
      id: tempId,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTodos(prevTodos => [...prevTodos, tempTodo]);
    setProcessingIds(prev => [...prev, tempId]);
    setIsLoading(true);

    createTodo(normalizedTitle)
      .then(newTodoFromServer => {
        setNewTodoTitle('');

        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === tempId ? newTodoFromServer : todo,
          ),
        );
      })
      .catch(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId));
        setError('Unable to add a todo');
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== tempId));
        setIsLoading(false);
        setTimeout(() => newTodoField.current?.focus(), 0);
      });
  };

  const hideError = () => {
    setError('');
  };

  let filteredTodos = todos;

  switch (filter) {
    case FilterType.Active:
      filteredTodos = todos.filter(todo => !todo.completed);
      break;

    case FilterType.Completed:
      filteredTodos = todos.filter(todo => todo.completed);
      break;

    default:
      break;
  }

  const activeTodosCount = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleDelete = (todoId: number) => {
    setProcessingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        newTodoField.current?.focus();
      })
      .catch(() => {
        setError('Unable to delete a todo');
        newTodoField.current?.focus();
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => null),
    );

    setIsLoading(true);

    Promise.all(deletePromises)
      .then(results => {
        const hasErrors = results.some(id => id === null);

        if (hasErrors) {
          setError('Unable to delete a todo');
        }

        setTodos(prevTodos =>
          prevTodos.filter(todo => !results.includes(todo.id)),
        );
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => newTodoField.current?.focus(), 0);
      });
  };

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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />
          <form onSubmit={handleFormSubmit}>
            <input
              ref={newTodoField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isLoading}
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
            />
          </form>
        </header>
        <fieldset disabled={isLoading}>
          <TodoList
            todos={filteredTodos}
            onDelete={handleDelete}
            processingIds={processingIds}
          />
        </fieldset>

        {todos.length > 0 && (
          <fieldset disabled={isLoading}>
            <Footer
              filter={filter}
              onFilterChange={setFilter}
              activeTodosCount={activeTodosCount}
              completedTodosCount={completedTodosCount}
              onClearCompleted={handleClearCompleted}
            />
          </fieldset>
        )}
      </div>

      {/* Компонент помилки покаже себе сам, якщо буде текст помилки */}
      <Notification error={error} onClose={hideError} />
    </div>
  );
};
