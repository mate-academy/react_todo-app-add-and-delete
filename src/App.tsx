/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteData, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { NavFilter, Filter } from './components/Filters';
import { FilteredTodos } from './components/FilteredTodos';

type Props = {
  todo: Todo[];
  userId: number;
};

export const App: React.FC<Props> = ({ userId }) => {
  enum ErrorMessage {
    Load = 'Unable to load todos',
    Add = 'Unable to add a todo',
    Delete = 'Unable to delete a todo',
    Update = 'Unable to update a todo',
    TitleEmpty = 'Title should not be empty',
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  // const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processing, setProcessing] = useState<number[]>([]);
  const field = useRef<HTMLInputElement>(null);
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);

      return;
    }

    setIsAdding(true);
    setTempTodo({ id: 0, title: title.trim(), userId, completed: false });
    try {
      const newTodo = await createTodo({
        title: title.trim(),
        userId,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
      field.current?.focus();
    } catch {
      setErrorMessage(ErrorMessage.Add);
      setTimeout(() => field.current?.focus(), 0);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      field.current?.focus();
    }
  };

  const deleteTodo = (id: number) => {
    setProcessing([...processing, id]);
    deleteData(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessing(prev => prev.filter(todoId => todoId !== id));
      });

    field.current?.focus();
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      deleteData(todo.id).then(() => todo.id),
    );

    Promise.allSettled(deletePromises).then(results => {
      const deletedIds = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      // Перевір чи є rejected
      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        setErrorMessage(ErrorMessage.Delete);
      }

      // Завжди видаляй успішні, навіть якщо є помилки
      setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));
    });

    field.current?.focus();
  };

  useEffect(() => {
    // setLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
    // .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!tempTodo && title === '') {
      field.current?.focus();
    }
  }, [tempTodo, title]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
              ref={field}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {/* This is a completed todo */}
            <FilteredTodos
              filter={filter}
              todos={todos}
              onDelete={deleteTodo}
              tempTodo={tempTodo}
              processing={processing}
            />
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <NavFilter filter={filter} setFilter={setFilter} />
            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
