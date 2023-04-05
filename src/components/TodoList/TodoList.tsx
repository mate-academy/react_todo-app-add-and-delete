import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TododInfo/TodoInfo';
import { removeTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  tempTodos: Todo | null
  handleRemoveTodo: (id: number) => void;
  deletedTodoIds: number[];
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodos,
    handleRemoveTodo,
    deletedTodoIds,
  }) => {
    return (
      <>
        {todos.map(todo => (
          <TodoInfo
            todo={todo}
            key={todo.id}
            handleRemoveTodo={handleRemoveTodo}
            deletedTodoIds={deletedTodoIds}
          />
        ))}

        {tempTodos
        && (
          <div
            className={classNames('todo', { completed: tempTodos.completed })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">
              {tempTodos.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(tempTodos.id)}
            >
              ×
            </button>

            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </>
    );
  },
);
