import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todosToShow: Todo[],
  tempTodo: Todo | null,
  onRemoveTodo:(id: number) => void,
  deletingTodoId: number,
  isDeletingCompleted: boolean,
};

export const TodoList: React.FC<Props> = ({
  todosToShow,
  tempTodo,
  onRemoveTodo,
  deletingTodoId,
  isDeletingCompleted,
}) => {
  return (
    <section className="todoapp__main">
      {todosToShow.map(todo => (
        <TodoItem
          todo={todo}
          deletingTodoId={deletingTodoId}
          isDeletingCompleted={isDeletingCompleted}
          onRemoveTodo={onRemoveTodo}
        />
      ))}

      {tempTodo && (
        <div
          key={tempTodo.id}
          className={classNames(
            'todo',
            { completed: tempTodo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>
          <span className="todo__title">{tempTodo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemoveTodo(tempTodo.id)}
          >
            ×
          </button>
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
