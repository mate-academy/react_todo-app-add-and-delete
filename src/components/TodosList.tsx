/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef } from 'react';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TodoItem from './TodoItem';
import classNames from 'classnames';

interface Props {
  todos: Todo[] | undefined;
  tempoTodo: Todo | null;
  isLoading: boolean;
  isLoadingTodo: number | null;
  handleChangeStatus: (todoId: number | undefined, newStatus: boolean) => void;
  handleDeleteTodo: (id?: number) => void;
}

const TodosList: React.FC<Props> = React.memo(
  ({
    todos,
    tempoTodo,
    isLoading,
    isLoadingTodo,
    handleChangeStatus,
    handleDeleteTodo,
  }) => {
    const nodeRef = useRef(null);

    if (!todos) {
      return;
    }

    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
              nodeRef={nodeRef}
            >
              <TodoItem
                todo={todo}
                isLoadingTodo={isLoadingTodo}
                onDelete={() => handleDeleteTodo(todo.id)}
                onChange={() => handleChangeStatus(todo.id, !todo.completed)}
              />
            </CSSTransition>
          ))}

          {/* {isLoading && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TodoItem todo={tempoTodo} isLoadingTodo={isLoadingTodo} />
            </CSSTransition>
          )} */}
        </TransitionGroup>
        {isLoading && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempoTodo && tempoTodo.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isLoading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>
    );
  },
);

TodosList.displayName = 'TodoList';
export default React.memo(TodosList);
