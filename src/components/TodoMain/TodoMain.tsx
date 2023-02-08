import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
};

export const TodoMain: React.FC<Props> = ({ todos, tempTodo, deleteTodo }) => {
  const [changeCheck, setChangeCheck] = useState<number>(-1);
  const [loading, setLoading] = useState(0);

  const onSubmitChanges = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setChangeCheck(-1);
  };

  const onDelete = (id: number) => {
    setLoading(id);
    deleteTodo(id);
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
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onDelete(id)}
                >
                  ×
                </button>

                {loading === id && (
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

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
