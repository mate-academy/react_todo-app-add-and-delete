import React, { useCallback, useMemo } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import classNames from 'classnames';

import { Loader } from '../Loader/Loader';

import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

interface Props {
  todos: Todo[];
  status: Status;
  newTodoTitle: string;
  isAdding: boolean;
  onDelete: (todoId: number) => void;
  ids: number[];
}

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    status,
    newTodoTitle,
    isAdding,
    onDelete,
    ids,
  } = props;

  const getVisibleTodos = useCallback((): Todo[] => {
    return todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
        default:
          return todos;
      }
    });
  }, [todos, status]);

  const visibleTodos = useMemo(
    getVisibleTodos,
    [todos, status],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo) => {
          const {
            id,
            title,
            completed,
          } = todo;

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
              unmountOnExit
              appear
            >
              <div
                data-cy="Todo"
                key={id}
                className={classNames(
                  'todo',
                  { completed },
                )}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    defaultChecked
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => onDelete(id)}
                >
                  ×
                </button>

                <Loader
                  id={id}
                  ids={ids}
                />
              </div>
            </CSSTransition>
          );
        })}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
            unmountOnExit
            appear
          >
            <div
              data-cy="Todo"
              key="0"
              className="todo"
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {newTodoTitle}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
              >
                ×
              </button>

              <Loader
                isAdding={isAdding}
              />
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
