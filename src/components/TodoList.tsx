import classNames from 'classnames';
import React from 'react';
import { Todo } from '../Types';

interface Props {
  todo: Todo[];
  visibleTodos: Todo[];
  isLoading: boolean;
  deleteTodo: (id: number) => Promise<void>;
  updateTodos: (id: number) => Promise<void>;
  deletedTodoId: number;
  isPlusOne: boolean;
}

export const TodoList: React.FC<Props> = ({
  todo,
  visibleTodos,
  isLoading,
  deleteTodo,
  updateTodos,
  isPlusOne,
  deletedTodoId,
}) => {
  return (
    <>
      {todo.length > -1 && (
        <>
          {visibleTodos.map((task) => {
            return deletedTodoId === task.id
              ? (
                <div className="loader" key={task.id} />
              ) : (
                <div
                  className={classNames('todo', {
                    completed: task?.completed,
                  })}
                  key={task.id}
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status todo__title-field"
                      checked={task.completed}
                      onChange={() => {
                        updateTodos(task.id);
                      }}
                    />
                  </label>
                  <span className="todo__title">{task.title}</span>
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => deleteTodo(task.id)}
                  >
                    ×
                  </button>
                  <div className="modal overlay">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                  </div>
                </div>
              );
          })}
          {isPlusOne && isLoading && (
            <div className="loader" />
          )}
        </>
      )}
    </>
  );
};
