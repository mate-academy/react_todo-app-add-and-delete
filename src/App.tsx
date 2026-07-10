/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodoError,
  todosService,
  TodosServiceError,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { useErrorMessage } from './hooks/useErrorMessage';
import { StatusFilter, TodoStatus } from './components/StatusFilter';
import { getSortedTodos } from './utils/getSortedTodos';
import { AddTodoForm, AddTodoFormData } from './components/AddTodoForm';
import { TodoCreate } from './types/TodoCreate';

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
          throw new Error('Massing case in getFilteredTodos status filter');
      }
    });
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusFilter, setStatusFilter] = useState(TodoStatus.All);
  const newTodoTitleRef = useRef<HTMLInputElement>(null);

  const { errorMessage, resetErrorMessage, setErrorMessage } =
    useErrorMessage();

  const { completed: completedTodos, active: activeTodos } =
    getSortedTodos(todos);

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
          setErrorMessage(getTodoError(TodosServiceError.UnableToDeleteTodo));
        })
        .finally(() => {
          handleToggleTodoLoading(todoId);

          newTodoTitleRef.current?.focus();
        });
    },
    [newTodoTitleRef, handleToggleTodoLoading, setErrorMessage],
  );

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [completedTodos, handleDeleteTodo]);

  const handleCreateTodo = useCallback(
    (values: AddTodoFormData, clear: () => void) => {
      if (newTodoTitleRef.current) {
        newTodoTitleRef.current.disabled = true;
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

      todosService
        .create(createTodoDto)
        .then(createdTodo => {
          setTodos(current => [...current, createdTodo]);
          clear();
        })
        .catch(() => {
          setErrorMessage(getTodoError(TodosServiceError.UnableToAddTodo));
        })
        .finally(() => {
          setTempTodo(null);
          if (newTodoTitleRef.current) {
            newTodoTitleRef.current.disabled = false;
          }

          newTodoTitleRef.current?.focus();
        });
    },
    [newTodoTitleRef, setErrorMessage],
  );

  useEffect(() => {
    todosService
      .list()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => {
        setErrorMessage(getTodoError(TodosServiceError.UnableToLoadTodos));
      })
      .finally();
  }, [setErrorMessage]);

  const filteredTodos = getFilteredTodos(todos, { status: statusFilter });

  const showTodosAndFooter = todos.length > 0;
  const showToggleButton = todos.length > 0;
  const showClearCompletedButton = completedTodos.length > 0;
  const activeTodosAmount = activeTodos.length;
  const shouldToggleButtonBeActive = completedTodos.length === todos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {showToggleButton && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: shouldToggleButtonBeActive,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <AddTodoForm
            ref={newTodoTitleRef}
            onError={setErrorMessage}
            onSubmit={handleCreateTodo}
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
                  loading={loadingTodoIds.includes(todo.id)}
                />
              ))}

              {tempTodo && <TodoItem todo={tempTodo} loading />}
            </section>

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosAmount} items left
              </span>

              <StatusFilter
                value={statusFilter}
                onValueChange={setStatusFilter}
              />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!showClearCompletedButton}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        notification={errorMessage}
        onClear={resetErrorMessage}
      />
    </div>
  );
};
