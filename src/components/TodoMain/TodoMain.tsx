import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
};

export const TodoMain: React.FC<Props> = ({ todos, tempTodo, deleteTodo }) => {
  const [activateEditById, setActivateEditById] = useState<number>(-1);
  const [activateLoadingOnTodo, setActivateLoadingOnTodo] = useState(0);
  const [tempTodoTitle, setTempTodoTitle] = useState('');

  const onSubmitChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setActivateEditById(-1);
  };

  const onDelete = (id: number) => {
    setActivateLoadingOnTodo(id);
    deleteTodo(id);
  };

  const activateEdit = (title: string, id: number) => {
    setTempTodoTitle(title);
    setActivateEditById(id);
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

            {activateEditById === id ? (
              <>
                <form onSubmit={onSubmitChanges}>
                  <input
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={tempTodoTitle}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      setTempTodoTitle(e.currentTarget.value);
                    }}
                  />
                </form>
              </>
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => activateEdit(title, id)}
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

                {activateLoadingOnTodo === id && (
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
