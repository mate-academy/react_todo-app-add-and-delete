/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, USER_ID, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterType } from './types/FilterType';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [, setLoading] = useState(false);
  const [filter, setFilter] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  //#region useEffect
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(resultat => setTodos(resultat))
      .catch(() => setErrorMessage(ErrorMessage.Load))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);
  //#endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  //#region functions
  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.Empty);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setIsSubmitting(true);
    setTempTodo(newTempTodo);
    try {
      const newTodo = await addTodo(newTempTodo);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch {
      setErrorMessage(ErrorMessage.Add);
      setTimeout(() => inputRef.current?.focus(), 0);
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingIds(ids => [...ids, id]);
    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setDeletingIds(ids => ids.filter(i => i !== id));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDelete(todo.id));
  };
  //#endregion

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
              ref={inputRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={deletingIds.includes(todo.id)}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}

        {tempTodo && (
          <TodoItem todo={tempTodo} isLoading={true} onDelete={handleDelete} />
        )}

        {/* Hide the footer if there are no todos */}
        <Footer
          todos={todos}
          filter={filter}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
