import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  removeTodo: (TodoId: number) => Promise<void>,
  selectedId: number[],
  isAdding: boolean,
  title: string,
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedId,
  title,
  isAdding,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          selectedId={selectedId}
        />
      ))}
      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <div
            data-cy="TodoLoader"
            className={classnames(
              'modal overlay',
              { 'is-active': isAdding },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
