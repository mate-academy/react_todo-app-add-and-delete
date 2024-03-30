/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodoFilter';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/Error';
import { wait } from './utils/fetchClient';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const titleField = useRef<HTMLInputElement>(null);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);
  const activeTodos = todos.filter((todo: Todo) => !todo.completed);

  useEffect(() => {
    setLoading(true);
    todoService
      .getTodos()
      .then(todosFromServer => {
        wait(1000);
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Error.UnableToLoadAll);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (titleField.current) {
      return titleField.current.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    let timeoutId = 0;

    if (errorMessage) {
      timeoutId = window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filterTodos = useCallback(
    (currentTodos: Todo[], currentFilter: Filter) => {
      if (currentFilter === Filter.Active) {
        return currentTodos.filter((todo: Todo) => !todo.completed);
      } else if (currentFilter === Filter.Completed) {
        return currentTodos.filter((todo: Todo) => todo.completed);
      } else {
        return currentTodos;
      }
    },
    [],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [filterTodos, filter, todos]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setErrorMessage('');
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (input.trim() === '') {
      setErrorMessage(Error.EmptyTitle);

      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTempTodo({
      id: 0,
      title: input.trim(),
      userId: todoService.USER_ID,
      completed: false,
    });

    if (tempTodo) {
      setTodos(prevTodos => [...prevTodos, tempTodo]);
    }

    return todoService
      .addTodo({
        userId: todoService.USER_ID,
        title: input.trim(),
        completed: false,
      })
      .then(newTodo => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== tempTodo?.id),
        );

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setInput('');
        setTempTodo(null);
      })
      .catch(error => {
        setTodos(todos);
        setTempTodo(null);
        setErrorMessage(Error.UnableToAdd);
        throw error;
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsSubmitting(true);
    setLoadingTodoIds(prev => [...prev, todoId]);

    return todoService
      .deleteTodos(todoId)
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.filter((todo: Todo) => todo.id !== todoId),
        ),
      )
      .catch(error => {
        setTodos(todos);
        setErrorMessage(Error.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setIsSubmitting(false);
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    setIsSubmitting(true);

    const deletePromises = completedTodos.map(todo => {
      setLoadingTodoIds(prev => [...prev, todo.id]);

      return todoService.deleteTodos(todo.id);
    });

    Promise.allSettled(deletePromises)
      .then(results => {
        const deletingIds: number[] = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            deletingIds.push(completedTodos[index].id);
          } else {
            setErrorMessage(Error.UnableToDelete);
          }
        });

        deletingIds.forEach(deletingId => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== deletingId),
          );
        });
      })
      .catch(error => {
        setTodos(todos);
        setErrorMessage(Error.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds([]);
        setIsSubmitting(false);
      });
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all ', {
              active: todos.every((todo: Todo) => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />
          <form onSubmit={submit}>
            <input
              ref={titleField}
              value={input}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleTitleChange}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {!loading && (
          <>
            <TodoList
              todos={filteredTodos}
              loadingTodoIds={loadingTodoIds}
              onDeleteTodo={handleDeleteTodo}
            />
            {tempTodo !== null && <TodoItem todo={tempTodo} />}
          </>
        )}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <TodosFilter filter={filter} onFilterChange={handleFilterChange} />
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
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseErrorMessage}
        />
        {errorMessage}
      </div>
    </div>
  );
};
