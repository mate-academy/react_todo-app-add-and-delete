/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
interface TodoListProps {
  filteredTodos: Todo[];
  updateTodoStatus: (todoId: number, completed: boolean) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  updateTodoStatus,
  deleteTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => {
          const { completed, id, title } = todo;

          return (
            <CSSTransition key={id} timeout={300} classNames="item">
              <div
                data-cy="Todo"
                className={`todo ${completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={completed}
                    onChange={() => updateTodoStatus(id, !completed)}
                  />
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTodo(id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${loadingTodoId === id ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
