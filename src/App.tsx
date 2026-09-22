/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import type Todo from './types/Todo';
import type { FilterType } from './types/FilterType';

import TodoList from './components/TodoList/TodoList';
import TodoItem from './components/TodoItem/TodoItem';
import Footer from './components/Footer/Footer';
import ErrorNotification from './components/ErrorNotification';

import './styles/index.scss';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [title, setTitle] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = React.useState<number | null>(
    null,
  );
  const newTodoInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(error => {
        /* eslint-disable no-console */
        console.error('Error fetching todos:', error);
        setErrorMessage('Unable to load todos');
        setIsErrorVisible(true);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoInputRef.current?.focus();
    }
  }, [isSubmitting]);

  const filter = (value: FilterType) => {
    setSelectedFilter(value);
  };

  const visibleTodos = React.useMemo(() => {
    switch (selectedFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  }, [todos, selectedFilter]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setIsErrorVisible(true);

      return;
    }

    setErrorMessage('');
    setIsErrorVisible(false);
    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addTodo({ title: trimmedTitle })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(error => {
        console.error('Error adding todo:', error);
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setIsErrorVisible(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    setIsErrorVisible(false);
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
        setErrorMessage('Unable to delete a todo');
        setIsErrorVisible(true);
      })
      .finally(() => {
        setDeletingTodoId(null);
        newTodoInputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');
    setIsErrorVisible(false);

    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        deleteTodo(todo.id)
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.filter(currentTodo => currentTodo.id !== todo.id),
            );
          })
          .catch(error => {
            console.error(`Error deleting todo ${todo.id}:`, error);
            setErrorMessage('Unable to delete a todo');
            setIsErrorVisible(true);
          })
          .finally(() => {
            newTodoInputRef.current?.focus();
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
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              disabled={isSubmitting}
              ref={newTodoInputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDelete}
            deletingTodoId={deletingTodoId}
          />
        )}

        {tempTodo && (
          <TodoItem todo={tempTodo} isLoading onDelete={handleDelete} />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            onFilterChange={filter}
            completedList={todos.filter(todo => todo.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        hidden={!isErrorVisible}
        onClose={() => setIsErrorVisible(false)}
      />
    </div>
  );
};
