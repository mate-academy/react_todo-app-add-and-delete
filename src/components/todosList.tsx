import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';
import '../styles/transitions.scss';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {
          todos.map((todo) => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoComponent
                todo={todo}
                onDelete={onDelete}
              />
            </CSSTransition>
          ))
        }
        {
          tempTodo !== null && (
            <CSSTransition
              timeout={300}
              classNames="temp-item"
            >
              <TodoComponent todo={tempTodo} />
            </CSSTransition>
          )
        }

      </TransitionGroup>

      {/* This todo is not completed */}
      {/* <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span className="todo__title">Not Completed Todo</span>
        <button type="button" className="todo__remove">×</button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

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
  );
};
