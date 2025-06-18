import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoError,
  TodoServiceError,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { StatusFilter, StatusFilterOptions } from './components/StatusFilter';
import { TodoCreateForm } from './components/TodoCreateForm';
import { TodoModify } from './types/TotoModify';

interface GetFilteredTodosFilters {
  status: StatusFilterOptions;
}

const getFilteredTodos = (todos: Todo[], filter: GetFilteredTodosFilters) => {
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
  const [todosLoading, setTodosLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(StatusFilterOptions.All);
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  const createFormRef = useRef<HTMLInputElement>(null);

  const handleAddTodoToProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => [...current, todoId]);
  };

  const handleRemoveTodoFromProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  };

  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);

  const handleHideError = useCallback(() => setErrorMessage(null), []);

  const showFooter = todos.length > 0;

  const filteredTodos = getFilteredTodos(todos, {
    status: statusFilter,
  });

  const completedTodos = todos.filter(todo => todo.completed);

  const activeTodosAmount = todos.length - completedTodos.length;

  useEffect(() => {
    if (createFormRef.current) {
      console;
    }
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(TodoServiceError.UnableToLoad);
      })
      .finally(() => setTodosLoading(false));
  }, []);

  const handleAddTodo = useCallback((title: Todo['title']) => {
    if (createFormRef.current) {
      createFormRef.current.disabled = true;
    }
    const newTodo: TodoModify = {
      title,
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
        setErrorMessage(TodoServiceError.UnableToAdd);

        throw new Error(TodoServiceError.UnableToAdd);
      })
      .finally(() => {
        setTemporaryTodo(null);

        if (createFormRef.current) {
          createFormRef.current.disabled = false;
          createFormRef.current.focus();
        }
      });
  }, []);

  const handleDeleteTodo = useCallback((todoId: Todo['id']) => {
    handleAddTodoToProcessing(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(TodoServiceError.UnableToDelete);
      })
      .finally(() => {
        handleRemoveTodoFromProcessing(todoId);
      });

    createFormRef.current?.focus();
  }, []);

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(completedTodo => {
      handleDeleteTodo(completedTodo.id);
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

          <TodoCreateForm
            ref={createFormRef}
            onSubmit={handleAddTodo}
            onError={setErrorMessage}
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
