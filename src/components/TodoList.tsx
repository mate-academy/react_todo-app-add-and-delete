/* eslint-disable no-console */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../Types';

interface Props {
  todo: Todo[],
  visibleTodos: Todo[],
  isLoading: boolean,
  tempTodo: Todo,
  updateIndividualTodo: (id: number) => Promise<void>,
  deleteTodo: (id: number) => Promise<void>,
}

export const TodoList: React.FC<Props> = ({
  todo,
  visibleTodos,
  isLoading,
  tempTodo,
  updateIndividualTodo,
  deleteTodo,
}) => {
  return (
    <>
      {todo.length > 0 && (
        <>
          {visibleTodos.map((task) => {
            return !isLoading ? (
              <div
                className={classNames('todo', {
                  completed: task.completed,
                })}
                key={task.id}
              >
                <label className="todo__status-label" key={task.id}>
                  <input
                    type="checkbox"
                    className="todo__status todo__title-field"
                    value={tempTodo.title}
                    checked={task.completed}
                    onChange={() => {
                      updateIndividualTodo(task.id);
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
                  <div className="modal-background
                has-background-white-ter"
                  />
                </div>
              </div>
            ) : (
              <div className="loader" key={task.id} />
            );
          })}
        </>
      )}
    </>
  );
};
