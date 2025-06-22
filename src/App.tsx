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
  TodoServiseErrors,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { StatusFilter, StatusFilterOptions } from './components/StatusFilter';
import { TodoCreateForm } from './components/TodoCreateForm';
import { TodoModify } from './types/TodoModify';

interface GetFilteredTodosFilters {
  status: StatusFilterOptions;
}

const getFilteredTodos = (todos: Todo[], filter: GetFilteredTodosFilters) => {
  let filteredTodos = [...todos];

  if (filter.status !== StatusFilterOptions.All) {
    filteredTodos = filteredTodos.filter(todo => {
      if (filter.status === StatusFilterOptions.Completed) {
        return todo.completed;
      }

      return !todo.completed;
    });
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(StatusFilterOptions.All);
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  const createFormRef = useRef<HTMLInputElement>(null);

  const handleAddTodoToProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => [...current, todoId]);
  };

  const handleRemoveTodoToProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  };

  const [errorMessage, setErrorMesage] = useState<TodoError | null>(null);

  const handleHideError = useCallback(() => setErrorMesage(null), []);

  const showFooter = todos.length > 0;

  const filteredTodos = getFilteredTodos(todos, {
    status: statusFilter,
  });

  const completedTodos = todos.filter(todo => todo.completed);

  const activeTodosAmount = todos.length - completedTodos.length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMesage(TodoServiseErrors.UnableToLoad);
      })
      .finally(() => setTodosLoading(false));
  }, []);

  const handleAddTodo = useCallback((title: Todo['title']) => {
    if (createFormRef.current) {
      createFormRef.current.disabled = true;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      if (createFormRef.current) {
        createFormRef.current.disabled = false;
        createFormRef.current.focus();
      }

      return Promise.resolve();
    }

    const newTodo: TodoModify = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTemporaryTodo({
      id: 0,
      ...newTodo,
    });

    return createTodo(newTodo)
      .then(todoFromServer => {
        setTodos(current => [...current, todoFromServer]);
      })
      .catch(() => {
        setErrorMesage(TodoServiseErrors.UnableToAddTodo);

        throw new Error(TodoServiseErrors.UnableToAddTodo);
      })
      .finally(() => {
        setTemporaryTodo(null);

        if (createFormRef.current) {
          createFormRef.current.disabled = false;
          createFormRef.current.focus();
        }
      });
  }, []);

  const handlDeleteTodo = useCallback((todoId: Todo['id']) => {
    handleAddTodoToProcessing(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));

        if (createFormRef.current) {
          createFormRef.current.focus();
        }
      })
      .catch(() => {
        setErrorMesage(TodoServiseErrors.UnableToDeleteTodo);
      })
      .finally(() => {
        handleRemoveTodoToProcessing(todoId);
      });
  }, []);

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(completedTodo => {
      handlDeleteTodo(completedTodo.id);
    });
  }, [completedTodos, handlDeleteTodo]);

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

          <TodoCreateForm
            ref={createFormRef}
            onSubmit={handleAddTodo}
            onError={setErrorMesage}
          />
        </header>

        {!todosLoading && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={handlDeleteTodo}
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

            {/* Hide the footer if there are no todos */}
            {showFooter && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodosAmount} items left
                </span>

                <StatusFilter
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={handleClearCompleted}
                  disabled={!completedTodos.length}
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
        onHideError={handleHideError}
      />
    </div>
  );
};
