/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import * as api from './api/todos';
import './App.scss';

/* components */
import { TodoItem } from './components/TodoItem/TodoItem';
import { Filter } from './components/Filter/Filter';
import { AddTodoForm } from './components/AddTodoForm/AddTodoForm';

/* types start */
import { Todo } from './types/Todo';
import { FilterOption } from './types/FilterOption';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [ErrorMsg, setErrorMsg] = useState<ErrorType | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterOption>(FilterOption.ALL);
  const [isLoadingIds, setIsLoadingIds] = useState<number[]>([]);

  const timerId = useRef<ReturnType<typeof setTimeout>>();
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleError = useCallback((msg: ErrorType | null) => {
    setErrorMsg(msg);

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = setTimeout(() => {
      setErrorMsg(null);
    }, 2999);
  }, []);

    const handleEdit = (id: number, title: string) => {
    if (!title.trim().length) {
      handleError(ErrorType.EmptyTitle);

      return;
    }

    setIsLoadingIds(prev => [...prev, id]);

    api
      .updateTodo(id, { title: title.trim() })
      .catch(() => {
        handleError(ErrorType.UnableToUpdate);
      })
      .finally(() => {
        setIsLoadingIds(prev => prev.filter(item => item !== id));
      });
  };

  const handleComplete = (id: number, completed: boolean) => {
    setIsLoadingIds(prev => [...prev, id]);

    api
      .updateTodo(id, { completed: completed })
      .then(() => {
        setTodos(prev => {
          return prev.map(item => {
            if (item.id === id) {
              return {
                ...item,
                completed: completed,
              };
            } else {
              return item;
            }
          });
        });
      })
      .catch(() => {
        handleError(ErrorType.UnableToUpdate);
      })
      .finally(() => {
        setIsLoadingIds(prev => prev.filter(item => item !== id));
      });
  };

  const handleDelete = (id: number) => {
    setIsLoadingIds(prev => [...prev, id]);

    return api
      .deleteTodo(id)
      .then(() => {
        setTodos(prev => {
          return prev.filter(item => item.id !== id);
        });
        newTodoField.current?.focus();
      })
      .catch(error => {
        handleError(ErrorType.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setIsLoadingIds(prev => prev.filter(item => item !== id));
      });
  };

  useEffect(() => {
    api
      .getTodos()
      .then(response => {
        setTodos(response);
      })
      .catch(() => {
        handleError(ErrorType.ServerError);
      });
  }, [handleError]);

  const visibleTodos = useMemo(() => {
    if (!todos) {
      return [];
    }

    return todos.filter(t => {
      switch (filter) {
        case FilterOption.COMPLETED:
          return t.completed;
        case FilterOption.ACTIVE:
          return !t.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const removeAllCompleted = () => {
    todos.map(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const onSubmit = (todo: string) => {
    setTempTodo({
      id: 0,
      userId: 0,
      title: todo,
      completed: false,
    });

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    return api
      .addTodo(todo)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
      })
      .catch(error => {
        handleError(ErrorType.UnableToAdd);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <AddTodoForm
            ref={newTodoField}
            setError={handleError}
            onSubmit={onSubmit}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos?.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  isLoading={Boolean(isLoadingIds.find(id => id === todo.id))}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="item">
                <TodoItem todo={tempTodo} isLoading={true} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <Filter currentFilter={filter} onApplyFilter={setFilter} />

            {/* this button should be disabled if there are no completed todos */}
            <button
              disabled={todos.filter(todo => todo.completed).length === 0}
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => removeAllCompleted()}
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
          { hidden: !ErrorMsg },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            if (timerId.current) {
              clearTimeout(timerId.current);
            }

            setErrorMsg(null);
          }}
        />
        {ErrorMsg}
      </div>
    </div>
  );
};
