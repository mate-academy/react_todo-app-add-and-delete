import React, { useEffect } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

export const TodoInfo = React.memo(
  ({
    todosFromServer,
    askTodos,
    setErrorMessage,
    setBlock,
  }: {
    todosFromServer: Todo[] | undefined;
    askTodos: (url: string) => void;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setBlock: {
      setCountComplited: React.Dispatch<React.SetStateAction<boolean>>;
      setCountNotComplited: React.Dispatch<React.SetStateAction<boolean>>;
    }
  }) => {
    useEffect(() => {
      if (todosFromServer) {
        const isCount = todosFromServer.some(
          (todo: Todo) => todo.completed === true,
        );
        const isNotCount = todosFromServer.some(
          (todo: Todo) => todo.completed === false,
        );

        setBlock.setCountNotComplited(isNotCount);
        setBlock.setCountComplited(isCount);
      }
    }, [todosFromServer]);

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
