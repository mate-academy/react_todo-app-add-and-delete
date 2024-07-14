import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';

const BASE_ERRORS: Errors = {
  loadingError: false,
  emptyTitleError: false,
  addingError: false,
  deletingError: false,
};

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>(BASE_ERRORS);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([-1]);

  const isError = useCallback(() => {
    return Object.values(errors).some(value => value);
  }, [errors]);

  const inputField = useRef<HTMLInputElement>(null);

  const errorTimeout = useRef(0);

  const resetErrors = useCallback(() => {
    window.clearTimeout(errorTimeout.current);

    errorTimeout.current = window.setTimeout(() => {
      setErrors(BASE_ERRORS);
    }, 3000);
  }, []);

  const areThereCompletedTodos = useMemo(() => {
    return todosFromServer.some(todo => todo.completed);
  }, [todosFromServer]);

  const activeTodosCount = useMemo(() => {
    return todosFromServer.reduce((prev, todo) => {
      if (!todo.completed && todo.id !== -1) {
        return prev + 1;
      }

      return prev;
    }, 0);
  }, [todosFromServer]);

  const displayedTodos = useMemo(() => {
    switch (filter) {
      case Filter.all:
        return todosFromServer;

      case Filter.active:
        return todosFromServer.filter(todo => !todo.completed);

      case Filter.completed:
        return todosFromServer.filter(todo => todo.completed);
    }
  }, [todosFromServer, filter]);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }

    setLoading(true);

    getTodos()
      .then(setTodosFromServer)
      .catch(error => {
        setErrors({ ...BASE_ERRORS, loadingError: true });
        resetErrors();
        throw error;
      })
      .finally(() => setLoading(false));
  }, [resetErrors]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>, title: string) => {
      e.preventDefault();
      setErrors(BASE_ERRORS);
      if (!title.trim()) {
        setErrors({ ...BASE_ERRORS, emptyTitleError: true });
        resetErrors();

        return;
      }

      setTodosFromServer(currentTodos => [
        ...currentTodos,
        {
          id: -1,
          userId: USER_ID,
          title: title,
          completed: false,
        },
      ]);

      addTodo({ title: title.trim(), userId: USER_ID, completed: false })
        .then(newTodo => {
          setTodosFromServer(currentTodos => {
            return [...currentTodos.slice(0, -1), newTodo];
          });

          setNewTodoTitle('');
        })
        .catch(error => {
          setErrors({ ...BASE_ERRORS, addingError: true });
          resetErrors();
          setTodosFromServer(currentTodos => currentTodos.slice(0, -1));
          throw error;
        })
        .finally(() => {
          setTimeout(() => {
            if (inputField.current) {
              inputField.current.focus();
            }
          }, 0);
        });
    },
    [resetErrors],
  );

  const handleDelete = useCallback(
    (todoId: number) => {
      setErrors(BASE_ERRORS);
      setLoadingTodosIds(currentIds => [...currentIds, todoId]);
      deleteTodo(todoId)
        .then(() => {
          setTodosFromServer(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(error => {
          setErrors({ ...BASE_ERRORS, deletingError: true });
          resetErrors();
          throw error;
        })
        .finally(() => {
          setLoadingTodosIds(currentIds =>
            currentIds.filter(id => id !== todoId),
          );
          setTimeout(() => {
            if (inputField.current) {
              inputField.current.focus();
            }
          }, 0);
        });
    },
    [resetErrors],
  );

  const handleClearCompleted = useCallback(
    (todos: Todo[]) =>
      todos.forEach(todo => {
        if (todo.completed) {
          handleDelete(todo.id);
        }
      }),
    [handleDelete],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!displayedTodos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active:
                  todosFromServer.every(todo => todo.completed) &&
                  !!todosFromServer.length,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={e => handleSubmit(e, newTodoTitle)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={todosFromServer.some(todo => todo.id === -1)}
              ref={inputField}
            />
          </form>
        </header>

        {!loading && !!todosFromServer.length && (
          <TodoList
            todosFromServer={todosFromServer}
            displayedTodos={displayedTodos}
            loadingTodosIds={loadingTodosIds}
            filter={filter}
            setFilter={setFilter}
            activeTodosCount={activeTodosCount}
            areThereCompletedTodos={areThereCompletedTodos}
            handleDelete={handleDelete}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !isError() },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errors.loadingError && 'Unable to load todos'}
        {errors.emptyTitleError && 'Title should not be empty'}
        {errors.addingError && 'Unable to add a todo'}
        {errors.deletingError && 'Unable to delete a todo'}
      </div>
    </div>
  );
};
