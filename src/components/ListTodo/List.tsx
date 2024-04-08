/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types';
import { ItemTodo } from '../ItemTodo/Item';
import { ContextTodo } from '../ContextTodo';

interface Props {
  todos: Todo[];
}

export const ListTodo: React.FC<Props> = ({ todos }) => {
  const { tempTodo, errorMessage } = useContext(ContextTodo);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <ItemTodo key={todo.id} todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && !errorMessage && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
