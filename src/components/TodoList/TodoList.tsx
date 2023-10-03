import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { useTodos } from '../Context';
import { TodoItem } from '../TodoItem';

type MagicWords = 'active' | 'completed';

const ACTIVE_TODOS: MagicWords = 'active';
const COMPLETED_TODOS: MagicWords = 'completed';

export const TodoList: React.FC = () => {
  const {
    todos, filter, isLoading, tempTodo, deleteTodo,
  } = useTodos();

  const filteredTodos = () => {
    switch (filter) {
      case ACTIVE_TODOS:
        return todos.filter(todo => !todo.completed);

      case COMPLETED_TODOS:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos().map((todo) => {
          if (todos.length > 0) {
            return (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem {...todo} key={todo.id} />
              </CSSTransition>
            );
          }

          return null;
        })}
      </TransitionGroup>

      {/* Render the temporary todo with loader */}
      {tempTodo && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(tempTodo.id)}
          >
            x
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div data-cy="TodoLoader" className={`modal overlay ${isLoading && 'is-active'}`}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
