import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

export const TodoInfo = React.memo(
  ({
    todosFromServer,
    askTodos,
    setErrorMessage,
  }: {
    todosFromServer: Todo[] | undefined;
    askTodos: (url: string) => void;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    if (!todosFromServer) {
      askTodos('/todos?userId=6757');

      return (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">Todo is being saved now</span>
          <button type="button" className="todo__remove">
            ×
          </button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      );
    }

    return (
      <>
        {todosFromServer.map((todo: Todo) => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              askTodos={askTodos}
              setErrorMessage={setErrorMessage}
            />
          );
        })}
      </>
    );
  },
);
