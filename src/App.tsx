/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as reqs from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import cn from 'classnames';
import { SortType } from './types/SortType';
import { TodoInfo } from './components/TodoInfo/TodoInfo';
import { Err } from './types/Error';

export const App: React.FC = () => {
  //#region Hooks
  const [todos, setTodos] = useState<Todo[]>([]);

  const [error, setError] = useState<Err>('');
  const [title, setTitle] = useState('');

  const [sortType, setSortType] = useState<SortType>('all');
  const [tempTodo, setTempTodo] = useState<Todo | Omit<Todo, 'id'> | null>(
    null,
  );

  const [todosInLoad, setTodosInLoad] = useState<number[]>([]);
  const [activeAmount, setActiveAmount] = useState(0);

  const inputField = useRef<HTMLInputElement | null>(null);
  const timerId = useRef(0);
  //#endregion

  //#region debounce func
  function debounce(func: (presentErr: Err) => void, timeout: number) {
    return (presentErr: Err) => {
      window.clearTimeout(timerId.current);
      timerId.current = window.setTimeout(() => func(presentErr), timeout);
    };
  }
  //#endregion

  //#region Handlers
  const handlingTitleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError('');
    }

    setTitle(ev.target.value);
  };

  const handleErrors = useCallback((err: Err) => {
    setError(err);

    const debouncedFunc = debounce(setError, 3000);

    return debouncedFunc('');
  }, []);

  const handlingSortTypeChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    newType: SortType,
  ) => {
    event.preventDefault();

    if (sortType !== newType) {
      setSortType(newType);
    }
  };

  const handleLoading = (cid: number, status: 'add' | 'remove') => {
    if (status === 'add') {
      setTodosInLoad(c => [...c, cid]);
    } else {
      setTodosInLoad(c => c.filter(id => id !== cid));
    }
  };

  const handleReset = () => {
    setTitle('');
    setError('');
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: reqs.USER_ID,
      completed: false,
    };

    if (!title.trim()) {
      return handleErrors('Title should not be empty');
    }

    setTempTodo(newTodo);

    return reqs
      .addTodo(newTodo)
      .then(res => {
        handleReset();

        setTodos(currentTodos => [...currentTodos, res]);
        setActiveAmount(c => c + 1);
      })
      .catch(() => {
        handleErrors('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleActiveAmountChange = useCallback((tds: Todo[]) => {
    setActiveAmount(() => {
      const act = tds.reduce((prv, td) => {
        if (!td.completed) {
          return prv + 1;
        }

        return prv;
      }, 0);

      return act;
    });
  }, []);

  const handleChange = (todoId: number, changed: Partial<Todo>) => {
    handleLoading(todoId, 'add');

    return reqs
      .updateTodo(todoId, changed)
      .then(() => {
        setTodos(c => {
          return c.map(td => {
            if (td.id === todoId) {
              return { ...td, ...changed };
            }

            return td;
          });
        });
      })
      .catch(e => {
        handleErrors('Unable to update a todo');
        throw e;
      })
      .finally(() => {
        handleLoading(todoId, 'remove');
      });
  };

  const handleDelete = (todoId: number) => {
    handleLoading(todoId, 'add');

    return reqs
      .deleteTodo(todoId)
      .then(() => {
        setTodos(c => {
          let actAmount = activeAmount;

          const res = c.filter(td => {
            if (typeof td.id !== 'undefined') {
              if (todoId === td.id && !td.completed) {
                actAmount--;
              }

              return todoId !== td.id;
            }

            return true;
          });

          setActiveAmount(actAmount);

          return res;
        });
      })
      .catch(e => {
        handleErrors('Unable to delete a todo');
        throw e;
      })
      .finally(() => {
        handleLoading(todoId, 'remove');
      });
  };

  const handleCleanCompleted = () => {
    for (const todo of todos.filter(td => td.completed)) {
      handleDelete(todo.id);
    }
  };

  const handleAllCompleted = () => {
    let changeSide;

    if (activeAmount) {
      changeSide = true;
    } else {
      changeSide = false;
    }

    todos.forEach(td => {
      if (!td.completed && changeSide) {
        handleChange(td.id, { completed: changeSide });
      } else if (td.completed && !changeSide) {
        handleChange(td.id, { completed: changeSide });
      }
    });
  };

  const handleFiltering = () => {
    if (sortType === 'all') {
      return todos;
    }

    const newTds = todos.filter(todo => {
      switch (sortType) {
        case 'active':
          if (!todo.completed) {
            return true;
          }

          return false;

        case 'completed':
          if (!todo.completed) {
            return false;
          }

          return true;

        default:
          return true;
      }
    });

    return newTds;
  };
  //#endregion

  //#region Loading, focusing and filtering todos
  useEffect(() => {
    if (
      error === 'Unable to add a todo' ||
      error === 'Title should not be empty'
    ) {
      if (inputField.current) {
        inputField.current.focus();
      }
    }

    inputField.current?.focus();
  }, [error, todos.length]);

  useEffect(() => {
    reqs
      .getTodos()
      .then(tds => {
        setTodos(tds);
      })
      .catch(e => {
        handleErrors('Unable to load todos');
        throw e;
      });

    if (inputField.current) {
      inputField.current.focus();
    }
  }, [handleErrors]);

  useEffect(() => {
    handleActiveAmountChange(todos);
  }, [todos, handleActiveAmountChange]);
  //#endregion

  //#region TSX
  if (!reqs.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: activeAmount === 0 && todos.length - activeAmount > 0,
              })}
              data-cy="ToggleAllButton"
              onClick={handleAllCompleted}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handlingTitleChange}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <TodoList
          todos={handleFiltering()}
          handleDelete={handleDelete}
          handleChange={handleChange}
          inLoading={todosInLoad}
        />

        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            loading={true}
            handleDelete={handleDelete}
            handleChange={handleChange}
          />
        )}

        {todos.length !== 0 && (
          <TodoFooter
            todoAmount={activeAmount}
            completedAmount={todos.length - activeAmount}
            sortType={sortType}
            onSortChange={handlingSortTypeChange}
            handleCleanCompleted={handleCleanCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
  //#endregion
};
