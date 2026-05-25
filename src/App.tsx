/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodoError,
  todosService,
  TodosServiceError,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { useErrorMessage } from './hooks/useErrorMessage';
import { StatusFilter, TodoStatus } from './components/StatusFilter';
import cn from 'classnames';
// import { use } from 'chai';
import { AddTodoForm, AddTodoFormData } from './components/AddTodoForm';
import { TodoCreate } from './types/TodoCreate';
// import { has } from 'cypress/types/lodash';

function getFilteredTodos(todos: Todo[], { status }: { status: TodoStatus }) {
  let filteredTodos = todos;

  if (status !== TodoStatus.All) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (status) {
        case TodoStatus.Completed:
          return todo.completed;
        case TodoStatus.Active:
          return !todo.completed;
        default:
          throw new Error('Missing case in getFilteredTodos status filter');
      }
    });
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<TodoStatus>(TodoStatus.All);
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);
  const newTodoTitleRef = useRef<HTMLInputElement>(null);

  const { error, setError, resetErrorMessage } = useErrorMessage();

  const showTodosAndFooter = todos.length > 0;
  const showToggleAllButton = todos.length > 0;

  const filteredTodos = getFilteredTodos(todos, { status: statusFilter });

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = activeTodos.length;

  const allCompleted = completedTodos.length === todos.length;
  // const shouldShowClearCompletedButton = completedTodos.length > 0;
  const hasCompleted = completedTodos.length > 0;

  const isTodoLoading = useCallback(
    (todoId: number) => loadingTodoIds.includes(todoId),
    [loadingTodoIds],
  );

  const handleToggleTodoLoading = useCallback(
    (todoId: number) => {
      if (isTodoLoading(todoId)) {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
      } else {
        setLoadingTodoIds(current => [...current, todoId]);
      }
    },
    [isTodoLoading],
  );

  const handleDeleteTodo = useCallback(
    (todoId: number) => {
      handleToggleTodoLoading(todoId);
      todosService
        .delete(todoId)
        .then(() => {
          setTodos(current => current.filter(todo => todo.id !== todoId));
        })
        .catch(() => {
          setError(getTodoError(TodosServiceError.UnableToDeleteATodo));
        })
        .finally(() => {
          handleToggleTodoLoading(todoId);
          newTodoTitleRef.current?.focus();
        });
    },
    [newTodoTitleRef, handleToggleTodoLoading, setError],
  );

  const handleClearComplete = useCallback(() => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [completedTodos, handleDeleteTodo]);

  const handleCreateTodo = useCallback(
    (values: AddTodoFormData, clear: () => void) => {
      if (newTodoTitleRef.current) {
        newTodoTitleRef.current.focus();
      }

      const createTodoDto: TodoCreate = {
        title: values.title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...createTodoDto,
      });

      setIsCreatingTodo(true);

      todosService
        .create(createTodoDto)
        .then(CreatedTodo => {
          setTodos(current => [...current, CreatedTodo]);
          clear();
        })
        .catch(() => {
          setError(getTodoError(TodosServiceError.UnableToAddATodo));
        })
        .finally(() => {
          setTempTodo(null);
          setIsCreatingTodo(false);

          if (newTodoTitleRef.current) {
            newTodoTitleRef.current.disabled = false;
          }

          newTodoTitleRef.current?.focus();
        });
    },
    [newTodoTitleRef, setError],
  );

  useEffect(() => {
    resetErrorMessage();
    setLoading(true);

    todosService
      .list()
      .then((todosFromServer: Todo[]) => setTodos(todosFromServer))
      .catch(() => {
        setError(getTodoError(TodosServiceError.UnableToLoadTodos));
      })
      .finally(() => setLoading(false));
  }, [resetErrorMessage, setError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {showToggleAllButton && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              disabled={loading}
            />
          )}

          {/* Add a todo on form submit */}
          <AddTodoForm
            ref={newTodoTitleRef}
            onError={setError}
            onSubmit={handleCreateTodo}
            loading={isCreatingTodo}
          />
        </header>

        {showTodosAndFooter && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  loading={isTodoLoading(todo.id)}
                />
              ))}
              {tempTodo && (
                <TodoItem todo={tempTodo} loading onDelete={() => undefined} />
              )}
            </section>

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodosCount} items left
                </span>

                <StatusFilter
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={!hasCompleted}
                  onClick={handleClearComplete}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      <ErrorNotification notification={error} onClose={resetErrorMessage} />
    </div>
  );
};
