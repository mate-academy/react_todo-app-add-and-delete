/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  TodosErrorsService,
  todosErrorsServiceText,
  todosService,
  USER_ID,
} from './api/todos';
import { getFilteredTodos, Todo } from './types/Todo';
import cn from 'classnames';
import { TodoItems } from './components/TodoItems';
import {
  TodoStatusFilter,
  TODO_STATUS_FILTER_OPTIONS,
} from './components/TodoStatusFilter';
import { useErrorMessage } from './components/hooks/useErrorMessage';
import { TodoCreate } from './types/TodoCreate';
import { CreateTodoForm } from './components/CreateTodoForm';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<Todo['id'][]>([]);
  const [selectedStatus, setSelectedStatus] = useState(TodoStatusFilter.All);
  const { errorMessage, handleRemoveError, handleSetError } = useErrorMessage();
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const complitedTodos = todos.filter(todo => todo.completed);
  const todoTitleInputRef = useRef<HTMLInputElement>(null);

  const handleAddTodoToLoading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentLoading => [...currentLoading, todoId]);
  };

  const handleRemoveTodoToLoading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentLoading =>
      currentLoading.filter(id => id !== todoId),
    );
  };

  const handleDeleteTodo = (todoId: Todo['id']) => {
    handleAddTodoToLoading(todoId);
    handleRemoveError();
    todosService
      .deleteTodods(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleSetError(
          todosErrorsServiceText[TodosErrorsService.UNABLE_TO_DELETE_TODO],
        );
      })
      .finally(() => {
        handleRemoveTodoToLoading(todoId);
        todoTitleInputRef.current?.focus();
      });
  };

  const handleDeleteBulk = (todoId: Todo['id'][]) => {
    todoId.forEach(id => handleDeleteTodo(id));
  };

  const handleDeleteComplited = () => {
    handleDeleteBulk(complitedTodos.map(({ id }) => id));
  };

  const getIsTodoLoading = (todoId: Todo['id']) =>
    loadingTodoIds.includes(todoId);

  const handleAddComplited = (newTodoTitle: string, resetTitle: () => void) => {
    handleRemoveError();

    if (!todoTitleInputRef.current) {
      return;
    }

    const todoCreate: TodoCreate = {
      title: newTodoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...todoCreate,
    });

    todoTitleInputRef.current.disabled = true;

    // todosService;
    addTodos(todoCreate)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        resetTitle();
      })
      .catch(() => {
        handleSetError(
          todosErrorsServiceText[TodosErrorsService.UNABLE_TO_ADD_TODO],
        );
      })
      .finally(() => {
        setTempTodo(null);
        if (!todoTitleInputRef.current) {
          return;
        }

        todoTitleInputRef.current.disabled = false;
        todoTitleInputRef.current.focus();
      });
  };

  useEffect(() => {
    if (todoTitleInputRef.current) {
      todoTitleInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleSetError(
          todosErrorsServiceText[TodosErrorsService.UNABLE_TO_LOAD_TODOS],
        );
      })
      .finally(() => {});
  }, [handleSetError]);

  const filteredTodos = getFilteredTodos(todos, { status: selectedStatus });

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  const allCompleted = todos.length > 0 && activeCount === 0;

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
            className={cn('todoapp__toggle-all', {
              active: allCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          <CreateTodoForm
            ref={todoTitleInputRef}
            onSubmit={handleAddComplited}
            onError={handleSetError}
          />
        </header>

        {filteredTodos.length !== 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItems
                key={todo.id}
                todo={todo}
                isLoading={getIsTodoLoading(todo.id)}
                onDelete={handleDeleteTodo}
              />
            ))}

            {tempTodo && <TodoItems todo={tempTodo} isLoading />}
          </section>
        )}

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {Object.entries(TODO_STATUS_FILTER_OPTIONS).map(
                ([option, { href, testId, text }]) => (
                  <a
                    key={testId}
                    href={href}
                    className={cn('filter__link', {
                      selected: selectedStatus === option,
                    })}
                    data-cy={testId}
                    onClick={() =>
                      setSelectedStatus(option as TodoStatusFilter)
                    }
                  >
                    {text}
                  </a>
                ),
              )}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!complitedTodos.length}
              onClick={handleDeleteComplited}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleRemoveError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
