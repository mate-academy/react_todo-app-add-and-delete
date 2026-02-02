/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  createTodo,
  deleteTodo as deleteTodoRequest,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { NewTodoForm } from './components/NewTodoForm';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';

export enum ErrorMessage {
  None = '',
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Empty = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setError(ErrorMessage.None);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!tempTodo && processingIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, processingIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasTodos = todos.length > 0;
  const showTodoList = hasTodos || tempTodo;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.Empty);

      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(todoFromServer => {
        setTodos(current => [...current, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setError(ErrorMessage.Add);
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);

    deleteTodoRequest(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => setError(ErrorMessage.Delete))
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all"
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />
          <NewTodoForm
            title={title}
            setTitle={setTitle}
            onSubmit={handleAddTodo}
            disabled={!!tempTodo}
            inputRef={inputRef}
            error={error}
            setError={setError}
          />
        </header>

        {showTodoList && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDelete}
          />
        )}

        {hasTodos && (
          <Footer
            activeCount={activeCount}
            todos={todos}
            hasCompletedTodos={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorMessage.None)}
      />
    </div>
  );
};
