import React from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[] | null;
  newTodoTitle: string;
  isTodoAdded: boolean;
  removeTodo: (targetId: number) => void;
  deleteTodosId: number[];
};

export const Todos: React.FC<Props> = ({
  todos, newTodoTitle, isTodoAdded, removeTodo, deleteTodosId,
}) => {
  return (
    <TransitionGroup>
      {todos?.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <div
            id={`${todo.id}`}
            className={classNames('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                readOnly
              />
            </label>
            <span
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(todo.id)}
            >
              ×
            </button>
            <div className={classNames(
              'modal',
              'overlay',
              { 'is-active': deleteTodosId.includes(todo.id) },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </CSSTransition>
      ))}
      { isTodoAdded && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TempTodo title={newTodoTitle} />
        </CSSTransition>
      ) }
    </TransitionGroup>
  );
};
