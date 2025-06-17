/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoError,
  TodosErrors,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { FilterOptions, StatusFilter } from './components/StatusFilter';
//import cn from 'classnames';

interface GetFilteredTodosFilter {
  status: FilterOptions;
}

const getFilteredTodos = (todos: Todo[], filter: GetFilteredTodosFilter) => {
  return todos.filter(todo => {
    switch (filter.status) {
      case FilterOptions.Active:
        return !todo.completed;

      case FilterOptions.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);
  const [statusFiltration, setStatusFiltration] = useState(FilterOptions.All);
  const [proccesTodosId, setProcessTodosId] = useState<Todo['id'][]>([]);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodoProcessing = (todoId: Todo['id']) => {
    setProcessTodosId(current => [...current, todoId]);
  };

  const handleRemoveTodoFromProcessing = (todoId: Todo['id']) => {
    setProcessTodosId(current => current.filter(id => id !== todoId));
  };

  const handleHideErrors = useCallback(() => setErrorMessage(null), []);
  const showTheFooter = todos.length > 0;

  const filteredTodos = getFilteredTodos(todos, { status: statusFiltration });
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodoCount = todos.length - completedTodos.length;

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(TodosErrors.UnableToLoad);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeleteTodo = useCallback((todoId: Todo['id']) => {
    handleAddTodoProcessing(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(TodosErrors.UnableToDeleteTodo);
      })
      .finally(() => {
        handleRemoveTodoFromProcessing(todoId);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }, []);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(TodosErrors.TitleShouldNotBeEmpty);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    const temp = { ...newTodo, id: 0 };

    setTempTodo(temp);
    setIsAddingTodo(true);

    createTodo(newTodo)
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(TodosErrors.UnableToAddTodo);
        setNewTodoTitle(trimmedTitle);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAddingTodo(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [completedTodos, handleDeleteTodo]);

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
          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isAddingTodo}
              autoFocus
            />
          </form>
        </header>

        {!isLoading && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={handleDeleteTodo}
                  isLoading={proccesTodosId.includes(todo.id)}
                />
              ))}

              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onDeleteTodo={() => {}}
                  isLoading={true}
                />
              )}
            </section>

            {showTheFooter && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodoCount} items left
                </span>

                <StatusFilter
                  statusFiltration={statusFiltration}
                  onStatusFilterChange={setStatusFiltration}
                />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={completedTodos.length === 0}
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideErrors={handleHideErrors}
      />
    </div>
  );
};
