import classNames from 'classnames';
import { Todo } from '../types/Todo';

type ListOfTodos = {
  todos: Todo[],
  updateTodoStatus: (todo: Todo) => void,
  onDeleteTodo: (todo: Todo) => void,
  loadingIds: number[],
  tempTodo: Todo | null,
};

export const TodosList: React.FC<ListOfTodos> = ({
  todos,
  updateTodoStatus,
  onDeleteTodo,
  loadingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
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
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onClick={() => updateTodoStatus(todo)}
            />
          </label>

          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo)}
          >
            ×
          </button>

          <div
            className={classNames(
              'modal',
              'overlay',
              {
                'is-active': tempTodo?.id === todo.id
                  || loadingIds.some(id => todo.id === id),
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

    </section>
  );
};
