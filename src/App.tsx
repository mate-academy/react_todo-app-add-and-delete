/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { SortType } from './types/sortField';
import { ErrorField } from './types/errorField';

export const App: React.FC = () => {
  //#region states

  const todoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleted, setIsDeleted] = useState<Set<number>>(new Set()); // is chsnging for rendering condition
  const [query, setQuery] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  // const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<SortType>(SortType.default);

  const completedCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const inputFocus = () => {
    todoField.current?.focus();
  };

  //#endregion

  useEffect(() => {
    inputFocus();

    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setErrorMessage(ErrorField.loadError);
      });
  }, []);

  //#region error

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    setIsErrorVisible(true);

    const timer = setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleErrorClose = () => {
    setIsErrorVisible(false);
    setErrorMessage('');
  };
  //#endregion

  //#region handels
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (query.trim() === '') {
      setErrorMessage(ErrorField.emptyTitle);

      return Promise.resolve();
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    if (todoField.current) {
      todoField.current.disabled = true;
    }

    setTempTodo({ ...newTodo, id: 0 });

    return createTodo({ ...newTodo })
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorField.addError);
      })
      .finally(() => {
        setTempTodo(null);
        todoField.current!.disabled = false;
        inputFocus();
      });
  };

  const handleFilter = (field: SortType) => {
    setSortField(field);
  };

  const handleDelete = (todoId: number) => {
    setIsDeleted(currSet => {
      const newSet = new Set(currSet);

      newSet.add(todoId);

      return newSet;
    });

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorField.deleteError);
      })
      .finally(() => {
        setIsDeleted(currSet => {
          const newSet = new Set(currSet);

          newSet.delete(todoId);

          return newSet;
        });
        inputFocus();
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(todos.map(todo => ({ ...todo, completed: !allCompleted })));
  };

  const handleDeleteCompetedTodos = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(comleteTodo => comleteTodo.id);

    setIsDeleted(currSet => {
      const newSet = new Set(currSet);

      completedTodosId.forEach(id => newSet.add(id));

      return newSet;
    });

    const deletePromises = completedTodosId.map(id => deleteTodo(id));

    Promise.allSettled(deletePromises).then(results => {
      inputFocus();
      const successId = completedTodosId.filter((id, i) => {
        return results[i].status === 'fulfilled';
      });
      const failedId = completedTodosId.filter((id, i) => {
        return results[i].status === 'rejected';
      });

      if (successId.length > 0) {
        setTodos(curr =>
          curr.filter(oldTodo => !successId.includes(oldTodo.id)),
        );
      }

      if (failedId.length > 0) {
        setErrorMessage(ErrorField.deleteError);
      }

      setIsDeleted(currSet => {
        const newSet = new Set(currSet);

        completedTodosId.forEach(id => newSet.delete(id));

        return newSet;
      });
    });
  };
  // #endregion

  const visibleTodos = useMemo(() => {
    const copyTodos = [...todos];

    switch (sortField) {
      case SortType.active:
        return copyTodos.filter(todo => !todo.completed);
      case SortType.completed:
        return copyTodos.filter(todo => todo.completed);
      case SortType.default:
      default:
        return copyTodos;
    }
  }, [todos, sortField]);

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
            className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={todoField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${isDeleted.has(todo.id) ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo !== null && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {completedCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${sortField === SortType.default ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => handleFilter(SortType.default)}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${sortField === SortType.active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => handleFilter(SortType.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${sortField === SortType.completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilter(SortType.completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed === true)}
              onClick={handleDeleteCompetedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${isErrorVisible ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorClose}
        />
        {errorMessage}
      </div>
    </div>
  );
};
