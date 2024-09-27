import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { showErrorMesage } from '../../utils/showErrorMesage';

type Props = {
  todo: Todo;
  todosFunction: (el: Todo[]) => void;
  errorFunction: (el: string) => void;
  deletingFunction: (el: boolean) => void;
  deletingListId: number[];
  todos: Todo[];
  focusInput: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todosFunction,
  errorFunction,
  deletingFunction,
  deletingListId,
  todos,
  focusInput,
}) => {
  const { id, completed, title } = todo;

  const [loader, setLoader] = useState(false);

  const isDeleting = deletingListId.includes(id);

  const handleDeleteBtn = (todoId: number) => {
    setLoader(true);
    deletingFunction(true);

    deleteTodo(id)
      .then(() => {
        const updatedTodos = todos.filter((td: Todo) => td.id !== todoId);

        todosFunction(updatedTodos);
      })
      .catch(er => {
        showErrorMesage('Unable to delete a todo', errorFunction);
        throw er;
      })
      .finally(() => {
        setLoader(false);
        deletingFunction(false);
        setTimeout(() => focusInput(), 0);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={id}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
        <input
          data-cy="TodoStatus"
          id={`todo-status-${id}`}
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
        <span className="sr-only">
          Mark as {completed ? 'incomplete' : 'complete'}
        </span>
      </label>
      {false ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDeleteBtn(todo.id);
        }}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loader || isDeleting,
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        {/* eslint-enable max-len */}
        <div className="loader" />
      </div>
    </div>
  );
};
