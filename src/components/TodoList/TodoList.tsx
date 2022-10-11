import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import { Loader } from '../Loader/Loader';
import { Props } from './TodolistPropTypes';

export const TodoList : React.FC<Props> = ({
  todos,
  onDeleteTodo,
  loadingTodoId,
}) => {
  const onHendleDeleteTodo = (id: number) => {
    onDeleteTodo(id);
    deleteTodo(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {loadingTodoId === 0 && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-labe">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>
          <Loader />
        </div>
      )}

      {todos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed })}
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

            <span data-cy="TodoTitle" className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onHendleDeleteTodo(id)}
            >
              ×
            </button>

            {loadingTodoId === id && (
              <Loader />
            )}
          </div>
        );
      })}

    </section>
  );
};
