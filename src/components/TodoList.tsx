import classNames from 'classnames';
import React from 'react';
import { Todo } from '../Types';

interface Props {
  todo: Todo[];
  visibleTodos: Todo[];
  isLoading: boolean;
  deleteTodo: (id: number) => Promise<void>;
  deletedTodoId: number;
  isPlusOne: boolean;
  tempTodo: Todo | null;
  isThereIssue: boolean,
  isEveryThingDelete: boolean,
}

export const TodoList: React.FC<Props> = ({
  todo,
  visibleTodos,
  isLoading,
  deleteTodo,
  isPlusOne,
  deletedTodoId,
  tempTodo,
  isThereIssue,
  isEveryThingDelete,
}) => {
  return (
    <>
      {todo.length > -1 && (
        <>
          {visibleTodos.map((task) => {
            if (isEveryThingDelete && task.completed) {
              return (
                <div
                  className={classNames('todo todo-loader', {
                    completed: task?.completed,
                  })}
                  key={task.id}
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status todo__title-field"
                      checked={task.completed}
                      disabled
                    />
                  </label>
                  <span className="todo__title todo__title-container">
                    {task.title}
                    <div className="loader loader__ondelete" />
                  </span>
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
            }

            return deletedTodoId === task.id && isLoading
              ? (
                <div
                  className={classNames('todo todo-loader', {
                    completed: task?.completed,
                  })}
                  key={task.id}
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status todo__title-field"
                      checked={task.completed}
                      disabled
                    />
                  </label>
                  <span className="todo__title todo__title-container">
                    {task.title}
                    <div className="loader loader__ondelete" />
                  </span>
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
                      disabled
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
          {isPlusOne && isLoading && !isThereIssue && (
            <div
              className={classNames('todo todo-loader', {
                completed: tempTodo?.completed,
              })}
              key={tempTodo?.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status todo__title-field"
                  checked={tempTodo?.completed}
                  disabled
                />
              </label>
              <span className="todo__title  todo__title-container">
                {tempTodo?.title}
                <div className="loader loader__ondelete" />
              </span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteTodo(tempTodo?.id || 0)}
              >
                ×
              </button>
              <div className="modal overlay">
                <div
                  className="modal-background has-background-white-ter"
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
