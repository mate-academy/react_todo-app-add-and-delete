import cn from 'classnames';
import { useTodoContext } from '../../../Context/Context';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoForRender = () => {
  const {
    filteredList,
    tempTodo,
    handleDelite,
    onDelete,
  } = useTodoContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredList.map(({ title, completed, id }) => (
        <div
          key={id}
          data-cy="Todo"
          className={cn('todo',
            { completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            { title }
          </span>
          <button
            onClick={() => handleDelite(id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay',
              { 'is-active': tempTodo?.id === id || onDelete.includes(id) })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && <TodoItem />}
    </section>
  );
};
