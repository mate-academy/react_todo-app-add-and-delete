import React, { useContext } from 'react';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodosContext } from '../Store/Store';
import { TodoItem } from '../TodoItem/TodoItem';
import { getFilteredTodos } from '../../services/getFilteredTodos';

type Props = {};

export const Section: React.FC<Props> = React.memo(() => {
  const {
    todos, loading, filter, tempItem,
  } = useContext(TodosContext);

  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          </CSSTransition>
        ))}

        {tempItem && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              data-cy="Todo"
              className="todo"
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {tempItem.title}
              </span>

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', { 'is-active': loading })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
