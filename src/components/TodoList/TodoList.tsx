import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDeleteTodo,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo) => {
        const { id, title, completed } = todo;

        return (
          <CSSTransition
            key={id}
            timeout={300}
            classNames="item"
          >
            <div key={id} className={classNames('todo', { completed })}>
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked
                  readOnly
                />
              </label>

              <span className="todo__title">{title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => onDeleteTodo(String(todo.id))}
              >
                ×
              </button>

              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        );
      })}

      {tempTodo && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="item"
        >
          <div key={tempTodo.id} className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
