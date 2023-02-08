import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

export const TodoMain: React.FC<{ todos: Todo[] | null }> = ({ todos }) => {
  const [changeCheck, setChangeCheck] = useState<number>(-1);

  const onSubmitChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setChangeCheck(-1);
  };

  return (
    <section className="todoapp__main">
      {todos?.map((todo) => {
        const { completed, title, id } = todo;

        return (
          <div className={cn('todo', { completed })} key={id}>
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" checked />
            </label>

            {changeCheck === id ? (
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
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setChangeCheck(id);
                  }}
                >
                  {title}
                </span>
                <button type="button" className="todo__remove">
                  ×
                </button>
              </>
            )}

            <div className={cn('modal overlay', { 'is-active': !todo })}>
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
