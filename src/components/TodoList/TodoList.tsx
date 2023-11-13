import { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../Todo/Todo';
import { TodoContext } from '../../TodoContext';
import { Filter } from '../../types/Filter';
import { TodoType } from '../../types/TodoType';
import '../../styles/transition.scss';

export const TodoList = () => {
  const { todos, filterTodo, tempTodo } = useContext(TodoContext);

  const getFilteredList = (currentState: TodoType[]) => {
    switch (filterTodo) {
      case Filter.Active: {
        return currentState.filter(({ completed }) => !completed);
      }

      case Filter.Completed: {
        return currentState.filter(({ completed }) => completed);
      }

      default:
        return currentState;
    }
  };

  const filteredList = getFilteredList(todos);

  return (
    <TransitionGroup>
      {filteredList.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <Todo todo={todo} />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <div className="todo" data-cy="Todo">
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                data-cy="TodoStatus"
              />
            </label>

            <span className="todo__title" data-cy="TodoTitle">
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
  );
};
