import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todosToShow: Todo[],
  tempTodo: Todo | null,
  removeTodo:(id: number) => void,
  isWaitingForDelete: number,
  isDeletingCompleted: boolean,
};

export const TodoList: React.FC<Props> = ({
  todosToShow,
  tempTodo,
  removeTodo,
  isWaitingForDelete,
  isDeletingCompleted,
}) => {
  return (
    <section className="todoapp__main">
      {todosToShow.map(todo => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
          <div className={classNames(
            'modal overlay',
            {
              'is-active': (todo.id === 0
            || isWaitingForDelete === todo.id
            || (isDeletingCompleted && todo.completed)),
            },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div
          key={tempTodo.id}
          className={classNames(
            'todo',
            { completed: tempTodo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>
          <span className="todo__title">{tempTodo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => removeTodo(tempTodo.id)}
          >
            ×
          </button>
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
