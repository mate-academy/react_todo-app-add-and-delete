import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoSubmit } from './TodoSubmit';

interface Props {
  todos: Todo[] | null,
  filteringMode: string,
  userId: number,
}

let filteredTodos: Todo[] | null = [];

export const TodoList: React.FC<Props> = ({ todos, filteringMode, userId }) => {
  if (filteringMode !== 'all' && todos !== null) {
    switch (filteringMode) {
      case 'active':
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
    }
  } else {
    filteredTodos = todos;
  }

  return (
    <>
      <TodoSubmit userId={userId} />

      <section className="todoapp__main">
        {filteredTodos?.map(todo => (
          <div
            className={cn({
              todo: true,
              completed: todo.completed,
            })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                defaultChecked={todo.completed}
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

        {/* This todo is being edited */}
        {/* <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div> */}

        {/* This todo is in loadind state */}
        {/* <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">Todo is being saved now</span>
          <button type="button" className="todo__remove">×</button> */}

        {/* 'is-active' class puts this modal on top of the todo */}
        {/* <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div> */}
      </section>
    </>
  );
};
