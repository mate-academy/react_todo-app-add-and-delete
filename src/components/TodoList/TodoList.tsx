import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        todo.completed ? (
          <div key={todo.id} className="todo completed">
            <label className="todo__status-label">
              <input
                title="status"
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              // onClick={}
            >
              x
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ) : (
          <div className="todo">
            <label className="todo__status-label">
              <input
                title="status"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span className="todo__title">{todo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )
      ))}
    </section>
  );
};
