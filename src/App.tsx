/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodos,
  getTodos,
  TodoError,
  TodoServiceErrors,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { StatusFilter, StatusFilterOptions } from './components/StatusFilter';
import { TodoCreateForm } from './components/TodoCreateForm';
import { TodoModify } from './types/TodoModify';

interface GetFilteredTodosFiltres {
  status: StatusFilterOptions;
}

const getFilteredTodos = (todos: Todo[], filter: GetFilteredTodosFiltres) => {
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
  const [processingTodosIds, setProcessingTodosIds] = useState<Todo['id'][]>(
    [],
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const createFormRef = useRef<HTMLInputElement>(null);

  const handleAddToProcessing = (todoId: Todo['id']) => {
    setProcessingTodosIds(prev => [...prev, todoId]);
  };

  const handleRemoveProcessing = (todoId: Todo['id']) => {
    setProcessingTodosIds(prev => prev.filter(id => id !== todoId));
  };

  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);

  const handleHideError = useCallback(() => setErrorMessage(null), []);

  const filteredTodos = getFilteredTodos(todos, {
    status: statusFilter,
  });

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.length - completedTodos.length;

  const handleAddTodo = useCallback((title: Todo['title']) => {
    setErrorMessage(null);

    const titleTrimed = title.trim();

    if (createFormRef.current) {
      createFormRef.current.disabled = true;
    }

    const newTodo: TodoModify = {
      title: titleTrimed,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    return createTodo(newTodo)
      .then(todoFromServer => {
        setTodos(prev => [...prev, todoFromServer]);
      })
      .catch(() => {
        setErrorMessage(TodoServiceErrors.UnableToAdd);

        throw new Error(TodoServiceErrors.UnableToAdd);
      })
      .finally(() => {
        setTempTodo(null);

        if (createFormRef.current) {
          createFormRef.current.disabled = false;
          createFormRef.current.focus();
        }
      });
  }, []);

  const handleDeleteTodo = useCallback((todoId: Todo['id']) => {
    handleAddToProcessing(todoId);
    deleteTodos(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(TodoServiceErrors.UnableToDelete);
      })
      .finally(() => {
        handleRemoveProcessing(todoId);
        if (createFormRef.current) {
          createFormRef.current.focus();
        }
      });
  }, []);

  const handleClearCompleted = useCallback(() => {
    completedTodos.forEach(completedTodo => {
      handleDeleteTodo(completedTodo.id);
    });
  }, [completedTodos, handleDeleteTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(TodoServiceErrors.UnableToLoad);
      })
      .finally(() => setTodosLoading(false));
  }, []);

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
            onClick={handleClearCompleted}
            disabled={!completedTodos.length}
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
                  isLoading={processingTodosIds.includes(todo.id)}
                />
              ))}

              {/* This todo is being edited */}
              {/* <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label> */}

              {/* This form is shown instead of the title and remove button */}
              {/* <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
                </form>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div> */}

              {tempTodo && (
                <TodoItem todo={tempTodo} onDeleteTodo={() => {}} isLoading />
              )}
            </section>

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodos} items left
                </span>

                <StatusFilter
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                />

                {/* this button should be disabled if there are no completed todos */}
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={handleClearCompleted}
                  disabled={completedTodos.length === 0}
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
