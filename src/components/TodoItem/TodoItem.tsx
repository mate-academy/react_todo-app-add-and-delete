/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo, USER_ID } from '../../api/todos';
import { useState } from 'react';

interface Props {
  todo: Todo;
  todos: Todo[];
  isAdd: boolean;
  isChange: boolean;
  isDelete: boolean;
  tempId: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isChange,
  isDelete,
  isAdd,
  tempId,
  setTodos,
  setErrorMessage,
}) => {
  const { title, id, completed } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const [isEditTodo, setIsEditTodo] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleDeleteTodo = async () => {
    try {
      setIsLoading(true);
      await deleteTodo(id);

      setTodos((prevTodos: Todo[]) =>
        prevTodos.filter((currentTodo: Todo) => currentTodo.id !== id),
      );
      setIsLoading(true);
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (editTitle.trim().length) {
      if (editTitle !== title) {
        const newTodo = { ...todo, title: editTitle };

        setIsLoading(true);
        updateTodo(id, newTodo)
          .then(updatedTodo => {
            setTodos((prevTodos: Todo[]) =>
              prevTodos.map(currentTodo =>
                currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
              ),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to update a todo');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      handleDeleteTodo();
    }

    setIsEditTodo(false);
  };

  const handleSwitchCheck = () => {
    const newTodo = { ...todo, completed: !completed };

    setIsLoading(true);

    setTodos(prevTodos => {
      return prevTodos.map(currentTodo => {
        if (currentTodo.id === id) {
          updateTodo(id, newTodo)
            .catch(() => {
              setErrorMessage('Unable to update a todo');
            })
            .finally(() => setIsLoading(false));

          return newTodo;
        } else {
          return currentTodo;
        }
      });
    });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleSwitchCheck}
        />
      </label>
      {isEditTodo ? (
        <form onSubmit={e => handleSubmitEdit(e)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={text => setEditTitle(text.target.value)}
            onBlur={() => {
              handleSubmitEdit();
              setIsEditTodo(false);
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditTodo(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading ||
            (isAdd && USER_ID === id) ||
            (isChange && tempId.includes(todo.id)) ||
            (isDelete && tempId.includes(todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
