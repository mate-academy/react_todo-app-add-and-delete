/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';
import { NewTodo } from './components/NewTodo';
import classNames from 'classnames';
import { Filter } from './components/Filters';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const newTodoFocusRef = useRef<(() => void) | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const hideError = () => {
    setErrorMessage('');
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
        setIsLoading(false);
      })
      .catch(() => {
        showError('Unable to load todos');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const deleteTodo = (todoId: number) => {
    hideError();

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        newTodoFocusRef.current?.();
      })
      .catch(error => {
        showError('Unable to delete a todo');
        throw error;
      });
  };

  const renameTodo = (todoToUpdate: Todo, newTitle: string) => {
    hideError();

    return todoService
      .updateTodo({ ...todoToUpdate, title: newTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showError('Unable to rename a todo');
        throw error;
      });
  };

  const toggleTodo = (todoToUpdate: Todo) => {
    hideError();

    return todoService
      .updateTodo({ ...todoToUpdate, completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showError('Unable to update a todo');
        throw error;
      });
  };

  const toggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const targetCompleted = !allCompleted;

    hideError();

    for (const todo of todos) {
      if (todo.completed !== targetCompleted) {
        try {
          await toggleTodo(todo);
        } catch (error) {
          showError('Unable to toggle a todo');
        }
      }
    }
  };

  const handleAddTodo = async (title: string) => {
    hideError();

    if (!title.trim()) {
      showError('Title should not be empty');

      return Promise.resolve();
    }

    const tempTodo = {
      id: -1,
      userId: 1,
      title: title.trim(),
      completed: false,
    };

    setTodos(currentTodos => [...currentTodos, tempTodo]);

    return todoService
      .createTodo(title)
      .then(newTodo => {
        setTodos(current => [...current.filter(t => t.id !== -1), newTodo]);
      })
      .catch(error => {
        setTodos(current => current.filter(t => t.id !== -1));
        showError('Unable to add a todo');
        throw error;
      });
  };

  const ClearCompletedTodos = async () => {
    hideError();

    const completedTodos = todos.filter(todo => todo.completed);
    let anyError = false;

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
      } catch (error) {
        anyError = true;
      }
    }

    if (anyError) {
      showError('Unable to delete a todo');
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (currentFilter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(
    todo => !todo.completed && todo.id !== -1,
  ).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const allTodosCompleted = todos.length > 0 && activeTodosCount === 0;
  const shouldShowMain = todos.length > 0;

  if (isLoading) {
    return (
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <header className="todoapp__header">
            <NewTodo onAdd={handleAddTodo} disabled />
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {shouldShowMain && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allTodosCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAllTodos}
            />
          )}

          <NewTodo
            onAdd={handleAddTodo}
            onFocusRef={focusFn => {
              newTodoFocusRef.current = focusFn;
            }}
          />
        </header>

        {shouldShowMain && (
          <>
            <TodoList
              todos={filteredTodos}
              onDelete={deleteTodo}
              onRename={renameTodo}
              onToggle={toggleTodo}
              onError={showError}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
              </span>

              <Filter
                currentFilter={currentFilter}
                onFilterChange={setCurrentFilter}
              />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={completedTodosCount === 0}
                onClick={ClearCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification message={errorMessage} onClose={hideError} />
    </div>
  );
};
