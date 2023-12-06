import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null
};

export const Main: React.FC<Props> = ({ todos, tempTodo }) => {
  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem todo={todo} key={todo.id} />
        ))}
      </section>
      {tempTodo
        && (
          <div
            data-cy="Todo"
            className={classNames(
              'todo',
            )}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {tempTodo.title}
            </span>

            <button
              aria-label="deleteTodo"
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={
                classNames(
                  'is-active',
                  'modal',
                  'overlay',
                )
              }

            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
    </>
  );
};
