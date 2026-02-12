import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  processingIds: number[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
};

const TodoRow: React.FC<{
  todo: Todo;
  isProcessing: boolean;
  onDelete?: (todoId: number) => void;
}> = ({ todo, isProcessing, onDelete }) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <div className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        data-cy="TodoStatus"
        checked={todo.completed}
        readOnly
      />
    </div>

    <span className="todo__title" data-cy="TodoTitle">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete?.(todo.id)}
      disabled={isProcessing}
    >
      x
    </button>

    <div
      className={classNames('modal overlay', {
        'is-active': isProcessing,
      })}
      data-cy="TodoLoader"
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>

    <input
      type="text"
      className="todo__title-field"
      data-cy="TodoTitleField"
      value={todo.title}
      readOnly
    />
  </div>
);

export const TodoList: React.FC<Props> = ({
  todos,
  processingIds,
  tempTodo,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoRow
            todo={todo}
            isProcessing={processingIds.includes(todo.id)}
            onDelete={onDelete}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoRow todo={tempTodo} isProcessing />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
