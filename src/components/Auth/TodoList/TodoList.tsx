/* eslint-disable import/extensions */
import cN from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[],
  title: string,
  onDelete: (n: number) => void,
  selectTodo: (n: number[]) => void,
  isAdding: boolean,
  selectedTodo: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  title,
  onDelete,
  selectTodo,
  isAdding,
  selectedTodo,
}) => {
  const tempTodo = {
    id: 0,
    title,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={cN(
            'todo', { completed: todo.completed },
          )}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={todo.completed}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              onDelete(todo.id);
              selectTodo([todo.id]);
            }}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cN('modal overlay', {
              'is-active': selectedTodo.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <div
            data-cy="TodoLoader"
            className={cN('modal overlay', { 'is-active': isAdding })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
