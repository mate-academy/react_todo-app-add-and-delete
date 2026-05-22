/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterOptions } from './components/Filter';
import { TodoCard } from './components/Todo';

export enum Status {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const errorMaker = (errorText: string) => {
    setErrorMessage(errorText);
    inputRef.current?.focus();
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Status.Completed:
        return todo.completed;
      case Status.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const addNewTodo = async (text: string) => {
    const trimmedTitle = text.trim();

    if (!trimmedTitle) {
      errorMaker('Title should not be empty');

      return;
    }

    setErrorMessage(null);

    const todoToAdd: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(todoToAdd);

    try {
      const newTodo = await addTodo(trimmedTitle);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
    } catch {
      errorMaker('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const onDelete = async (id: number) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    } catch {
      errorMaker('Unable to delete a todo');
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
      inputRef.current?.focus();
    }
  };

  const clearcompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => onDelete(todo.id)));
  };

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    getTodos()
      .then(items => {
        setTodos(items);
        inputRef.current?.focus();
      })
      .catch(() => {
        errorMaker('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hideError = () => setErrorMessage(null);
  const activeTodosCount = todos.filter(item => !item.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.every(t => t.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={e => {
              e.preventDefault();
              addNewTodo(title);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              ref={inputRef}
              onChange={e => setTitle(e.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodoList
                todos={filteredTodos}
                onDelete={onDelete}
                processingIds={processingIds}
              />
              {tempTodo && (
                <TodoCard todo={tempTodo} onDelete={onDelete} isProcessed />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              <FilterOptions changeOption={setFilter} />
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!todos.some(t => t.completed)}
                onClick={() => clearcompleted()}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        {errorMessage}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
      </div>
    </div>
  );
};
