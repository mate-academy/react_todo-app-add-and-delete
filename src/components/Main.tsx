import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[] | null,
  onDeleting: boolean,
  onDeleteTodo: (id: number) => void
};

export const Main: React.FC<Props> = ({
  visibleTodos,
  onDeleting,
  onDeleteTodo,
}) => {
  const [changeCheck, setChangeCheck] = useState(false);

  const changeForm = () => {
    setChangeCheck(true);
  };

  const onSubmitChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setChangeCheck(false);
  };

  return (
    <section className="todoapp__main">
      {visibleTodos?.map(todo => {
        const {
          completed,
          title,
          id,
        } = todo;

        const deleting = () => {
          onDeleteTodo(id);
        };

        return (
          <div className={classNames('todo', { completed })} key={id}>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            {changeCheck
              ? (
                <>
                  <form onSubmit={onSubmitChanges}>
                    <input
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={title}
                    />
                  </form>
                </>
              )
              : (
                <>
                  <span
                    className="todo__title"
                    onDoubleClick={changeForm}
                  >
                    {title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    onClick={deleting}
                  >
                    ×
                  </button>

                  {onDeleting && (
                    <div className="modal overlay is-active">
                      <div
                        className="modal-background has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  )}
                </>
              )}
          </div>
        );
      })}
    </section>
  );
};
