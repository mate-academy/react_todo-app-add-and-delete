import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  isDeleteTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos, onDelete = () => {}, tempTodo, isDeleteTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed === true,
          })}
        >
          <TodoItem
            todo={todo}
            onDelete={onDelete}
            isLoadingId={isDeleteTodoId === todo.id}
          />
        </div>
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className={classNames(
            'modal overlay',
            { 'is-active': isDeleteTodoId === tempTodo.id },
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
