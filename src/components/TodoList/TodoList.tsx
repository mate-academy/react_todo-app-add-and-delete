/* eslint-disable max-len */
import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessageEnum } from '../../types/ErrorMessageEnum';
import { deleteTodo, updateTodo } from '../../api/todos';

interface Props {
  todos: Todo[],
  allTodos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<'' | ErrorMessageEnum>>,
  tempTodo: Todo | null,
}

export const TodoList: React.FC<Props> = ({
  todos,
  allTodos,
  setTodos = () => { },
  setAllTodos = () => { },
  setErrorMessage = () => { },
  tempTodo,
}) => {
  const [loader, seLoader] = useState<boolean>(false);
  const [editID, setEditID] = useState<number>();
  const [deleteID, setDeleteID] = useState<number>();
  const [editInput, setEditInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckComplete = async (id: number) => {
    // loader ?
    const newTodos = [...allTodos].map(todo => {
      if (todo.id === id) {
        const newTodo = { ...todo, completed: !todo.completed };

        try {
          updateTodo(newTodo);

          return newTodo;
        } catch {
          setErrorMessage(ErrorMessageEnum.UpdateTodoError);
        }
      }

      return todo;
    });

    setAllTodos(newTodos);
    setTodos(newTodos); // ??
  };

  const handleDeleteTodo = async (id: number) => {
    setDeleteID(id);

    seLoader(true);

    try {
      await deleteTodo(id);

      setAllTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessageEnum.DeleteTodoError);
    } finally {
      seLoader(false);
    }
  };

  const handleDobuleClick = (id: number, title: string) => {
    setEditID(id);
    setEditInput(title);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditInput(event.target.value);
  };

  const saveEditTodo = async (
    event: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    event.preventDefault();
    const currentTitle = editInput.trim();

    if (!currentTitle) {
      handleDeleteTodo(id);

      return;
    }

    if (!id) {
      return;
    }

    try {
      const indexOfTodo = [...todos].findIndex(todo => todo.id === id);
      const newTodo = { ...todos[indexOfTodo], title: currentTitle };

      await updateTodo(newTodo);

      const newTodos = [...todos].map(todo => (todo.id === id ? newTodo : todo));

      setAllTodos(newTodos);
      setTodos(newTodos);
    } catch {
      setErrorMessage(ErrorMessageEnum.UpdateTodoError);
    } finally {
      setEditID(undefined);
      setEditInput('');
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const { id, title, completed } = todo;
        const isEditing = editID === id;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={() => handleCheckComplete(id)}
              />
            </label>
            {
              isEditing
                ? (
                  <form onSubmit={event => saveEditTodo(event, id)}>
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={editInput}
                      onChange={handleEditInputChange}
                      ref={inputRef}
                      onBlur={() => setEditID(undefined)}
                    />
                  </form>

                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => handleDobuleClick(id, title)}
                    >
                      {title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => handleDeleteTodo(id)}
                    >
                      ×
                    </button>
                  </>
                )
            }
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': loader && deleteID === id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {
        tempTodo && (
          <>
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: tempTodo.completed,
              })}
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  onChange={() => handleCheckComplete(tempTodo.id)}
                />
              </label>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleDobuleClick(tempTodo.id, tempTodo.title)}
              >
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(tempTodo.id)}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': true,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </>
        )
      }
    </section>
  );
};
