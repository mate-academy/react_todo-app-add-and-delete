/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoError } from './types/TodoErrors';
import { TodoFilter } from './types/TodoFilter';
import { TodoItem } from './componets/TodoItem';
import { HeaderTodo } from './componets/HeaderTodo';
import { FooterTodo } from './componets/FooterTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<TodoError>(TodoError.None);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const hideError = () => setErrorMessage(TodoError.None);

  useEffect(() => {
    hideError();
    setLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(TodoError.LoadTodos))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (errorMessage === TodoError.None) {
      return;
    }

    const timer = setTimeout(() => {
      hideError();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding, processingId]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    hideError();
  };

  async function handleAddTodo(newTodo: Omit<Todo, 'id'>) {
    setTempTodo({ ...newTodo, id: 0 });
    setIsAdding(true);
    hideError();

    try {
      const savedTodo = await todoService.addTodos(newTodo);

      setTodos(currentTodos => [...currentTodos, savedTodo]);

      setTitle('');
    } catch {
      setErrorMessage(TodoError.AddTodo);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  }

  async function handleDeleteTodo(todoId: number) {
    setProcessingId(ids => [...ids, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(TodoError.DeleteTodo);
    } finally {
      setProcessingId(ids => ids.filter(id => id !== todoId));
    }
  }

  function handleClearComplited() {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        return handleDeleteTodo(todo.id);
      });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normilizedTitle = title.trim();

    if (!normilizedTitle) {
      setErrorMessage(TodoError.EmptyTitle);

      return;
    }

    handleAddTodo({
      userId: todoService.USER_ID,
      title: normilizedTitle,
      completed: false,
    });
  };

  const allCompleted =
    Boolean(todos.length) && todos.every(todo => todo.completed);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo
          allCompleted={allCompleted}
          inputRef={inputRef}
          title={title}
          isAdding={isAdding}
          onSubmit={handleSubmit}
          onTitleChange={handleTitleChange}
        />

        {!loading && Boolean(todos.length) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  isProcessing={processingId.includes(todo.id)}
                />
              ))}
              {tempTodo && <TodoItem todo={tempTodo} isProcessing={isAdding} />}
            </section>

            {/* Hide the footer if there are no todos */}
            <FooterTodo
              activeCount={activeCount}
              filter={filter}
              hasCompleted={hasCompleted}
              onFilterChange={setFilter}
              onClearCompleted={handleClearComplited}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
