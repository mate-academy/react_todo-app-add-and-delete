/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo, TodoData } from './types/Todo';
import { SelectedFiltering } from './types/SelectedType';
import { TodoList } from './TodoMain/TodoList';
import { TodoLoadingError } from './TodoLoadingError';
import { AddTodoForm } from './AddTodo/AddTodoForm';

const USER_ID = 10397;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasTitleError, setHasTitleError] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [filteringBy, setFilteringBy] = useState(SelectedFiltering.All);
  const [tempTodo, setTempTodo] = useState<null | TodoData>(null);
  const [isCreatingError, setIsCreatingError] = useState(false);

  const loadTodos = useCallback(async () => {
    setIsLoadingError(false);

    try {
      const todosFromServer: Todo[] = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setIsLoadingError(true);
    }
  }, []);

  const addTodo = useCallback(async (todoData: TodoData) => {
    setIsCreatingError(false);
    setTempTodo(todoData);

    try {
      await createTodo(todoData);
      loadTodos();
      setTempTodo(null);
    } catch {
      setIsCreatingError(true);
    }
  }, []);

  const removeTodo = useCallback(async (todoDeletedId: number) => {
    const deletedTodo = await deleteTodo(todoDeletedId);

    setTodos(prevTodos => prevTodos.filter(todo => todo !== deletedTodo));
    loadTodos();
  }, []);

  useEffect(
    () => {
      loadTodos();
    },
    [],
  );

  const visibleTodos = todos.filter(({ completed }) => {
    switch (filteringBy) {
      case SelectedFiltering.Active:
        return !completed;

      case SelectedFiltering.Completed:
        return completed;

      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddTodoForm
          setHasTitleError={setHasTitleError}
          addTodo={addTodo}
          userId={USER_ID}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
        />

        {isLoadingError && <TodoLoadingError />}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.length} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link', {
                    selected: filteringBy === SelectedFiltering.All,
                  },
                )}
                onClick={() => setFilteringBy(SelectedFiltering.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link', {
                    selected: filteringBy === SelectedFiltering.Active,
                  },
                )}
                onClick={() => setFilteringBy(SelectedFiltering.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link', {
                    selected: filteringBy === SelectedFiltering.Completed,
                  },
                )}
                onClick={() => setFilteringBy(SelectedFiltering.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button type="button" className="todoapp__clear-completed">
              Clear completed
            </button>
          </footer>
        )}

        {hasTitleError && isCreatingError && (
          // eslint-disable-next-line max-len
          <div className="notification is-danger is-light has-text-weight-normal">
            <button type="button" className="delete" />
            Unable to add a todo
          </div>
        )}
      </div>
    </div>
  );
};
