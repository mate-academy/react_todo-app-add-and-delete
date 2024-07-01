import React, { Dispatch, SetStateAction, useState, useRef } from 'react';
import { TodoInterface } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

interface Props {
  todos: TodoInterface[];
  refreshTodos: Dispatch<SetStateAction<TodoInterface[]>>;
  setErrorMsg: (arg: string) => void;
}

const TodoComponent: React.FC<Props> = ({
  todos: initialTodos,
  refreshTodos,
  setErrorMsg,
}) => {
  const [todoClickToEdit, setTodoClickToEdit] = useState(-1);
  const [valueInInputForEditTodo, setValueInInputForEditTodo] = useState('');
  const [requestRunning, setRequestRunning] = useState(true);
  const refTodoToEdit = useRef<HTMLInputElement>(null);

  const handleOnclickCompletTodo = (idx: number) => {
    return () => {
      refreshTodos(todos => {
        const newTodos = [...todos];

        newTodos[idx].isAwaitServer = true;

        return newTodos;
      });
      updateTodo(initialTodos[idx].id, {
        completed: !initialTodos[idx].completed,
      })
        .then(res => {
          refreshTodos(todos => {
            const newTodos = [...todos];

            newTodos[idx] = res as TodoInterface;
            newTodos[idx].isAwaitServer = false;

            return newTodos;
          });
        })
        .catch(() => {
          setErrorMsg('Unable to update a todo');
          refreshTodos(todos => {
            const newTodos = [...todos];

            newTodos[idx].isAwaitServer = false;

            return newTodos;
          });
        });
    };
  };

  const handleOnDeleteButtonTodo = (idx: number) => {
    return () => {
      refreshTodos(todos => {
        const newTodos = [...todos];

        newTodos[idx].isAwaitServer = true;

        return newTodos;
      });

      deleteTodo(initialTodos[idx].id)
        .then(() => {
          refreshTodos(todos => {
            const newTodos = todos.filter((_, i) => i !== idx);

            return newTodos;
          });
        })
        .catch(() => {
          setErrorMsg('Unable to delete a todo');
        });
    };
  };

  const saveData = (idx: number) => {
    return () => {
      let indexTodoToBeUpdated: number;

      refreshTodos(prev => {
        indexTodoToBeUpdated = prev.findIndex(
          e => e.id === initialTodos[idx].id,
        );
        const newPrev = [...prev];

        newPrev[indexTodoToBeUpdated].isAwaitServer = true;

        return newPrev;
      });

      if (valueInInputForEditTodo === initialTodos[idx].title) {
        setTodoClickToEdit(-1);
        setValueInInputForEditTodo('');

        return;
      }

      if (valueInInputForEditTodo !== '') {
        setRequestRunning(false);
        updateTodo(initialTodos[idx].id, {
          title: valueInInputForEditTodo.trim(),
        })
          .then(res => {
            refreshTodos(prev => {
              setTodoClickToEdit(-1);
              const newPrev = [...prev];

              newPrev[indexTodoToBeUpdated] = { ...res, isAwaitServer: false };

              return newPrev;
            });
            setRequestRunning(true);
          })
          .catch(() => {
            refreshTodos(prev => {
              const newPrev = [...prev];

              newPrev[indexTodoToBeUpdated].isAwaitServer = false;
              setErrorMsg('Unable to update a todo');

              return newPrev;
            });
            setRequestRunning(true);
          });
      } else {
        deleteTodo(initialTodos[idx].id)
          .then(() => {
            refreshTodos(todos => {
              const newTodos = todos.filter((_, i) => i !== idx);

              return newTodos;
            });
            setRequestRunning(true);
          })
          .catch(() => {
            refreshTodos(prev => {
              const newPrev = [...prev];

              newPrev[indexTodoToBeUpdated].isAwaitServer = false;
              setErrorMsg('Unable to delete a todo');

              return newPrev;
            });
            setRequestRunning(true);
          });
      }
    };
  };

  const handleOnBlurEvent = (idx: number) => {
    return () => {
      if (requestRunning) {
        saveData(idx)();
      }
    };
  };

  const handleClickToEdit = (idx: number) => {
    return () => {
      setTodoClickToEdit(initialTodos[idx].id);
      setValueInInputForEditTodo(initialTodos[idx].title);
    };
  };

  const handleOnSubmitEditFormTodo = (idx: number) => {
    return (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      saveData(idx)();
    };
  };

  const handleOnChangeFormTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValueInInputForEditTodo(event.target.value);
  };

  const handleEscapeKeyInFormEditTodo = (idx: number) => {
    return (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setValueInInputForEditTodo(initialTodos[idx].title);
        setTodoClickToEdit(-1);
        refreshTodos(prev => [...prev]);
      }
    };
  };

  return (
    <>
      {initialTodos.map(({ id, title, completed, isAwaitServer }, index) => {
        return (
          <div
            key={id}
            data-cy="Todo"
            className={`todo ${completed && 'completed'}`}
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onClick={handleOnclickCompletTodo(index)}
            />

            {todoClickToEdit === id ? (
              <form onSubmit={handleOnSubmitEditFormTodo(index)}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  onChange={handleOnChangeFormTodo}
                  onBlur={handleOnBlurEvent(index)}
                  autoFocus={todoClickToEdit === id}
                  ref={refTodoToEdit}
                  onKeyDown={handleEscapeKeyInFormEditTodo(index)}
                  value={valueInInputForEditTodo}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={handleClickToEdit(index)}
                >
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={handleOnDeleteButtonTodo(index)}
                >
                  ×
                </button>
              </>
            )}
            <div
              data-cy="TodoLoader"
              className={`modal overlay ${isAwaitServer && 'is-active'}`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </>
  );
};

export const Todo = React.memo(TodoComponent);
