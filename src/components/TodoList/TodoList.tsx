import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[]
  deleteTodo: (todoId: number) => void
  selectedTodoId: number | null
  completedTodos: number[]
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  selectedTodoId,
  deleteTodo,
  completedTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const {
          completed,
          id,
          title,
        } = todo;

        return (

          <div
            data-cy="Todo"
            className={classNames('todo', {
              'item-enter-done': !completed,
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {!title ? 'Empty todo' : title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>

            { (selectedTodoId === todo.id
              || completedTodos.includes(todo.id))
              && (
                <div
                  data-cy="TodoLoader"
                  className="
                  overlay
                  is-flex
                  is-justify-content-center
                  is-align-items-center
                  "
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              )}
          </div>
        );
      })}
    </section>
  );
};
