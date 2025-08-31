/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoRow } from './components/TodoRow';
import { WarningError } from './components/WarningError';
import { USER_ID } from './utils/preferences';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // #region loading
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const startLoading = (id: number) => {
    setLoadingTodos(prev => [...prev, id]);
  };

  const stopLoading = (id: number) => {
    setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
  };
  // #endregion

  function showError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        showError('Unable to load todos');
      });
  }, []);

  // #region deleteTodo
  const deleteTodo = (todoId: number) => {
    startLoading(todoId);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
          inputRef.current?.focus();
        }
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        stopLoading(todoId);
      });
  };

  const handleDeleteAllCompletedTodos = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => startLoading(todo.id!));

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo =>
          todoService.deleteTodo(todo.id!).then(() => todo.id),
        ),
      );

      const successfulIds: number[] = [];
      let hasError = false;

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          successfulIds.push(result.value);
        } else {
          hasError = true;
        }
      });

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id!)),
      );

      if (hasError) {
        showError('Unable to delete a todo');
      } else {
        inputRef.current?.focus();
      }
    } finally {
      completedTodos.forEach(todo => stopLoading(todo.id!));
    }
  };

  // #endregion

  // #region updatedTodo
  const renameTodo = (todoToUpdate: Todo, newTitle: string) => {
    startLoading(todoToUpdate.id!);

    return todoService
      .updateTodo({ ...todoToUpdate, title: newTitle })
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        ),
      )
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        stopLoading(todoToUpdate.id!);
      });
  };

  // #endregion

  // #region ToggleTodo
  const toggleTodo = (todoToUpdate: Todo) => {
    startLoading(todoToUpdate.id!);

    return todoService
      .updateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        showError('Unable to toggle a todo');
      })
      .finally(() => {
        stopLoading(todoToUpdate.id!);
      });
  };

  const toggleAllTodos = async () => {
    todos.forEach(todo => startLoading(todo.id!));
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);

    try {
      await Promise.all(updatedTodos.map(todo => todoService.updateTodo(todo)));
      todos.forEach(todo => stopLoading(todo.id!));
    } catch (error) {
      showError('Unable to toggle all todos');
      todoService.getTodos().then(setTodos);
    }
  };

  // #endregion

  // #region createTodo
  const createTodo = (newTitle: string) => {
    if (!newTitle.trim()) {
      return;
    }

    setIsCreating(true);

    const tempTodo: Todo & { isTemp: boolean } = {
      id: Date.now(),
      title: newTitle,
      completed: false,
      userId: USER_ID,
      isTemp: true,
    };

    setTodos(current => [...current, tempTodo]);
    startLoading(tempTodo.id);

    todoService
      .createTodo(newTitle)
      .then(newTodo => {
        setTodos(current =>
          current.map(todo => (todo.id === tempTodo.id ? newTodo : todo)),
        );
        setTitle('');
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTodos(current => current.filter(todo => todo.id !== tempTodo.id));
      })
      .finally(() => {
        stopLoading(tempTodo.id);
        setIsCreating(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const handleCreateTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (!title.trim()) {
      showError('Title should not be empty');

      return;
    }

    createTodo(title.trim());
  };
  // #endregion

  // #region filterTodos
  function filterTodos(array: Todo[]): Todo[] {
    switch (filter) {
      case 'active':
        return array.filter(todo => !todo.completed);
      case 'completed':
        return array.filter(todo => todo.completed);
      default:
        return array;
    }
  }

  const handleFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const value = event.currentTarget.getAttribute('href')?.slice(2) || '';

    setFilter(value);
  };

  const filteredTodos = filterTodos(todos);

  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length > 0 && todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAllTodos}
            />
          )}

          <form onSubmit={e => e.preventDefault()}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              onKeyDown={handleCreateTodo}
              autoFocus
              ref={inputRef}
              disabled={isCreating}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            return (
              <TodoRow
                key={todo.id}
                todo={todo}
                onDelete={() => deleteTodo(todo.id)}
                onRename={(newTitle: string) => renameTodo(todo, newTitle)}
                onToggleTodo={() => toggleTodo(todo)}
                onLoading={loadingTodos.includes(todo.id!)}
              />
            );
          })}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {/* eslint-disable-next-line */}
              {
                todos.filter(todo => !todo.completed && !todo.isTemp).length
              }{' '}
              items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: filter === '' })}
                data-cy="FilterLinkAll"
                onClick={handleFilter}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={handleFilter}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={handleFilter}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteAllCompletedTodos}
              disabled={todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <WarningError
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
