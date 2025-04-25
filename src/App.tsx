import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todoService from './api/todos';

import { TodoList } from './components/TodoList';
import { TodoCard } from './components/TodoCard';
import { Footer } from './components/Footer';
import ErrorNotification from './components/ErrorNotification';

import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';

// Enum для фільтрів
export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const errorTimerId = useRef(0);
  const formInput = useRef<HTMLInputElement>(null);
  const todosCounter = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - todosCounter;

  const showError = (message: string) => {
    setError(message);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.LOAD_ERROR));

    formInput.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading && !tempTodo) {
      formInput.current?.focus();
    }
  }, [isLoading, tempTodo]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const onFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      showError(ErrorMessage.TITLE_ERROR);

      return;
    }

    setIsLoading(true);

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    todoService
      .addTodo(title)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        showError(ErrorMessage.ADD_ERROR);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await todoService.deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      showError(ErrorMessage.DELETE_ERROR);
      throw err;
    } finally {
      formInput.current?.focus();
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      todoService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          showError(ErrorMessage.DELETE_ERROR);
        })
        .finally(() => {
          formInput.current?.focus();
        });
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

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={formInput}
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>

        {todos.length !== 0 && (
          <TodoList todos={filteredTodos} onDelete={handleDeleteTodo} />
        )}

        {tempTodo && (
          <section className="todoapp__main">
            <TodoCard todo={tempTodo} onDelete={handleDeleteTodo} />
          </section>
        )}

        {todos.length !== 0 && (
          <Footer
            todosCounter={todosCounter}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={onFilterChange}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
