import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  idProcessed: number,
  disableList: boolean,
  onDelete: (todoId: number) => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  idProcessed,
  disableList,
  onDelete,
}) => {
  const onRemove = (todoId: number | undefined) => () => (
    todoId ? onDelete(todoId) : null
  );

  return (
    <section className="todoapp__main is-loading">
      {todos.map(todo => (
        <div
          className={classNames(
            'todo',
            {
              completed: todo.completed,
            },
          )}
          key={todo.id}
        >
          <label
            className="todo__status-label"
          >
            <input
              type="checkbox"
              className="todo__status"
              disabled={disableList}
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={onRemove(todo.id)}
            disabled={disableList}
          >
            ×
          </button>

          <div className={classNames('modal overlay', {
            'is-active': idProcessed === todo.id,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo !== null ? (
        <div
          className={classNames(
            'todo',
            {
              completed: tempTodo.completed,
            },
          )}
        >
          <label
            className="todo__status-label"
          >
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <button
            type="button"
            className="todo__remove"
          >
            ×
          </button>

          <div className={classNames('modal overlay', {
            'is-active': tempTodo.id === 0,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) : tempTodo}
    </section>
  );
};
