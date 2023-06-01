import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../utils/TodosContext';

interface PropsTodoList {
  filteredTodos: Todo[];
}
export const TodoList = ({ filteredTodos }: PropsTodoList) => {
  const {
    tempTodo, loading, handleDeleteTodo, handleClickCheck,
  } = useTodosContext();

  return (
    <section className="todoapp__main">
      {filteredTodos.length > 0 && filteredTodos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            className={cn({
              todo: !completed,
              'todo completed': completed,
            })}
            key={id}
          >
            <label
              className="todo__status-label"
            >
              <input
                type="checkbox"
                className="todo__status"
                checked={completed}
                onClick={() => handleClickCheck(todo)}
              />
            </label>

            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(todo)}
            >
              ×

            </button>
            <div className={cn({
              'modal overlay': !loading,
              'modal overlay is-active': loading,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && <span className="todo__title">{tempTodo.title}</span>}
    </section>
  );
};
