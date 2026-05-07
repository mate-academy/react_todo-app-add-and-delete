import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Filter } from './Filter';
import { TodoList } from './TodoList';
import * as Interaction from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  setError: (str: string) => void;
};

enum UpdateAll {
  completed = 'completed',
  active = 'active',
}

export const TodoApp: React.FC<Props> = ({ setError }) => {
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState(false);
  const [activeTodos, setActiveTodos] = useState<Todo[] | null>(null);
  const [todosFormServer, setTodosFormServer] = useState<Todo[] | null>(null);
  const [updateAllTodos, setUpdateAllTodo] = useState<UpdateAll>(
    UpdateAll.completed,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const focusInput = useRef<HTMLInputElement | null>(null);

  //#region function

  const updateList = useCallback(() => {
    Interaction.getTodos()
      .then((serverTodos: Todo[] | null) => {
        setTodos(serverTodos);
        setTodosFormServer(serverTodos);
      })
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setEditing(null);
        setLoadingTodo(false);
        setActiveTodos(null);
        setTimeout(() => {
          setError('');
        }, 3000);
        focusInput.current?.focus();
      });
  }, [setError]);

  useEffect(() => {
    updateList();
  }, [updateList]);

  const addTodo = useCallback(
    (inputValue: string) => {
      if (inputValue.trim()) {
        setDisabledInput(true);
        const newData: Omit<Todo, 'id'> = {
          userId: Interaction.USER_ID,
          title: inputValue.trim(),
          completed: false,
        };

        setTempTodo({ ...newData, id: 0 });

        setTimeout(
          () =>
            Interaction.addTodo(newData)
              .then(newTodos => {
                setTodos(oldTodos => {
                  if (oldTodos) {
                    return [...oldTodos, newTodos];
                  }

                  return [newTodos];
                });
                setTodosFormServer(oldTodos => {
                  if (oldTodos) {
                    return [...oldTodos, newTodos];
                  }

                  return [newTodos];
                });
                setValue('');
              })
              .catch(() => {
                setError('Unable to add a todo');
              })
              .finally(() => {
                setTempTodo(null);
                setDisabledInput(false);
                setTimeout(() => {
                  focusInput.current?.focus();
                }, 0);
              }),
          200,
        );
      } else {
        setValue('');
        setError('Title should not be empty');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    },
    [setError, setTodosFormServer, setTodos],
  );

  const updateTodo = useCallback(
    (newData: Todo) => {
      setLoadingTodo(true);
      setTimeout(() => {
        Interaction.updateTodo(newData)
          .then(() => {})
          .catch(() => {
            setError('Unable to update a todo');
          })
          .finally(() => {
            updateList();
          });
      }, 300);
    },
    [updateList, setError],
  );

  const deleteTodo = useCallback(
    (id: number, activeTodo: Todo) => {
      setLoadingTodo(true);
      setActiveTodos(current =>
        current ? [...current, activeTodo] : [activeTodo],
      );
      setTimeout(() => {
        Interaction.deleteTodo(id)
          .then(() => {
            setTodos(prev => (prev ? prev.filter(todo => todo.id !== id) : []));
            setTodosFormServer(prev =>
              prev ? prev.filter(todo => todo.id !== id) : [],
            );
          })
          .catch(() => {
            setError('Unable to delete a todo');
          })
          .finally(() => {
            setTimeout(() => {
              focusInput.current?.focus();
            }, 0);
            setLoadingTodo(false);
          });
      }, 500);
    },
    [setError, setTodos, setTodosFormServer],
  );

  const allUpdateList = useCallback(
    (oldTodos: Todo[] | null) => {
      if (oldTodos) {
        if (updateAllTodos === UpdateAll.completed) {
          oldTodos.map(todo => {
            if (todo.completed === false) {
              updateTodo({ ...todo, completed: true });
            }
          });
          setUpdateAllTodo(UpdateAll.active);
        } else {
          oldTodos.map(todo => {
            if (todo.completed === true) {
              updateTodo({ ...todo, completed: false });
            }
          });
          setUpdateAllTodo(UpdateAll.completed);
        }
      }
    },
    [updateAllTodos, updateTodo],
  );

  //#endregion function

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        {todos && todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: updateAllTodos === UpdateAll.active,
            })}
            data-cy="ToggleAllButton"
            onClick={() => {
              allUpdateList(todosFormServer);
            }}
          />
        )}

        <form
          onSubmit={e => {
            e.preventDefault();
            addTodo(value);
          }}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            autoFocus
            ref={focusInput}
            disabled={disabledInput}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </form>
      </header>

      {todos && (
        <TodoList
          todos={todos}
          updateTodo={prev => updateTodo(prev)}
          deleteTodo={(prevId, prevTodo) => deleteTodo(prevId, prevTodo)}
          editing={editing}
          setEditing={prev => setEditing(prev)}
          loadingTodo={loadingTodo}
          setActiveTodos={prev => setActiveTodos(prev)}
          activeTodos={activeTodos}
          tempTodo={tempTodo}
        />
      )}

      {todosFormServer && todosFormServer.length > 0 && (
        <Filter
          todosFormServer={todosFormServer}
          setTodos={prev => setTodos(prev)}
          updateList={() => updateList()}
          deleteTodo={(prevId, prevTodo) => deleteTodo(prevId, prevTodo)}
        />
      )}
    </div>
  );
};
