/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorMessages';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { StatusFilterOptions } from './types/StatusFilterOptions';
import { FilterByStatus } from './components/FilterByStatus';
import { TodoCreateForm } from './components/TodoCreateForm';

interface GetFilteredTodosFilter {
  status: StatusFilterOptions;
}

const getFilteredTodos = (todos: Todo[], filter: GetFilteredTodosFilter) => {
  let filteredTodos = [...todos];

  if (filter.status !== StatusFilterOptions.All) {
    filteredTodos = filteredTodos.filter(todo => {
      return filter.status === StatusFilterOptions.Completed
        ? todo.completed
        : !todo.completed;
    });
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);

  const [filterStatus, setFilterStatus] = useState<StatusFilterOptions>(
    StatusFilterOptions.All,
  );

  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]); //All Todos that processing at the momemnt
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  const createFormRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadTodos() {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(ErrorMessages.UnableToLoad);
      } finally {
        setTodosLoading(false);
      }
    }

    loadTodos();
  }, []);

  const handleCreateTodo = useCallback(
    async (title: Todo['title']): Promise<Todo> => {
      if (createFormRef.current) {
        createFormRef.current.disabled = true;
      }

      const newTodo = {
        title,
        completed: false,
        userId: USER_ID,
      };

      const tempTodo: Todo = {
        id: 0,
        ...newTodo,
      };

      setTemporaryTodo(tempTodo);

      try {
        const createTodo = await addTodo(newTodo);

        setTodos(currentTodos => [...currentTodos, createTodo]);

        return createTodo;
      } catch {
        setErrorMessage(ErrorMessages.AddTodo);
        throw new Error(ErrorMessages.AddTodo);
      } finally {
        setTemporaryTodo(null);
        if (createFormRef.current) {
          createFormRef.current.disabled = false;
          createFormRef.current.focus();
        }
      }
    },
    [],
  );

  const handleDeleteTodo = useCallback(async (todoId: Todo['id']) => {
    setProcessingTodoIds(curr => [...curr, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));

      if (createFormRef.current) {
        createFormRef.current.focus();
      }
    } catch (error) {
      setErrorMessage(ErrorMessages.DeleteTodo);
    } finally {
      setProcessingTodoIds(current => current.filter(id => id !== todoId));
    }
  }, []);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.length - completedTodos.length;

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(completedTodo => {
      handleDeleteTodo(completedTodo.id);
    });
  }, [completedTodos, handleDeleteTodo]);

  const handleHideError = useCallback(() => setErrorMessage(null), []);

  const showFooter = todos.length > 0;

  const filteredTodos = getFilteredTodos(todos, {
    status: filterStatus,
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <TodoCreateForm
            ref={createFormRef}
            onSubmit={handleCreateTodo}
            onError={setErrorMessage}
            todosLoading={todosLoading}
          />
        </header>

        {!todosLoading && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={handleDeleteTodo}
                  isLoading={processingTodoIds.includes(todo.id)}
                />
              ))}

              {temporaryTodo && (
                <TodoItem
                  todo={temporaryTodo}
                  onDeleteTodo={() => {}}
                  isLoading
                />
              )}
            </section>

            {showFooter && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodos} items left
                </span>

                <FilterByStatus
                  statusFilter={filterStatus}
                  onStatusFilterChange={setFilterStatus}
                />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={!completedTodos.length}
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
        onHideError={handleHideError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
