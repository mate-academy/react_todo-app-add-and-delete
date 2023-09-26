import classNames from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (v: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete = () => { },
}) => {
  return (
    <section className="todoapp__main">

      {todos.map(todo => {
        const { title, completed, id } = todo;

        return (
          <div
            key={todo.id}
            className={classNames('todo', { completed })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                defaultChecked={todo.completed}
                className="todo__status"
              />
            </label>

            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

    </section>
  );
};
