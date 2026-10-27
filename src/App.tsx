/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Error } from './types/Error';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import classNames from 'classnames';
import { TodoItem } from './components/TodoItem';

const enum Filter {
  'all' = 'all',
  'active' = 'active',
  'completed' = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setError(Error.loadTodo);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    switch (filter) {
      case Filter.all:
        setFilteredTodos([...todos]);
        break;
      case Filter.active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case Filter.completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
    }
  }, [filter, todos]);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef.current?.focus();
    }
  }, [isInputDisabled]);

  const deleteTodoFromServer = async (
    todoId: number,
  ): Promise<Error | null> => {
    try {
      await deleteTodo(todoId);

      return null;
    } catch {
      return Error.deleteTodo;
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(currentIds =>
      currentIds.includes(todoId) ? currentIds : [...currentIds, todoId],
    );

    try {
      const deleteError = await deleteTodoFromServer(todoId);

      if (deleteError) {
        setError(deleteError);

        return;
      }

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleDeleteCompletedTodo = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...completedTodoIds.filter(id => !currentIds.includes(id)),
    ]);

    try {
      const results = await Promise.all(
        completedTodos.map(async todo => {
          const deleteError = await deleteTodoFromServer(todo.id);

          return { id: todo.id, error: deleteError };
        }),
      );

      const deletedIds = results
        .filter(result => result.error === null)
        .map(result => result.id);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !deletedIds.includes(todo.id)),
      );

      if (results.some(result => result.error !== null)) {
        setError(Error.deleteTodo);
      }
    } finally {
      setLoadingTodoIds(currentIds =>
        currentIds.filter(id => !completedTodoIds.includes(id)),
      );
      inputRef.current?.focus();
    }
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      setError(Error.emptyTitle);

      return;
    }

    const todoData = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsInputDisabled(true);

    setTempTodo({
      id: 0,
      ...todoData,
    });

    try {
      const newTodo = await addTodo(todoData);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTodoTitle('');
      setError(null);
    } catch {
      setError(Error.addTodo);
    } finally {
      setIsInputDisabled(false);
      setTempTodo(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
    setError(null);
  };

  const isAllTodosCompleted =
    todos.every(todo => todo.completed) && todos.length > 0;
  const isCompletedTodos = todos.some(todo => todo.completed);
  const todosCounter = todos.filter(todo => !todo.completed).length;
  const clearError = useCallback(() => setError(null), []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllTodosCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleInputChange}
              disabled={isInputDisabled}
              autoFocus
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onTodoDelete={handleDeleteTodo}
            loadingTodoIds={loadingTodoIds}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loading={true}
            onTodoDelete={handleDeleteTodo}
          />
        )}

        {(tempTodo || todos.length > 0) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounter} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === Filter.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === Filter.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === Filter.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!isCompletedTodos}
              onClick={handleDeleteCompletedTodo}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification error={error} onDismiss={clearError} />
    </div>
  );
};
