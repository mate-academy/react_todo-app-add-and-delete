import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/TodoError';
import * as todoService from '../api/todos';

type Props = {
  todos: Todo[],
  setTodosFromServer: (todos: Todo[]) => void,
  setErrorMesage: (error: TodoError) => void,
  newAddedTodoId: number | null,
};

export const Main: React.FC<Props> = ({
  todos,
  setErrorMesage,
  setTodosFromServer,
  newAddedTodoId,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  useEffect(() => {
    todoService.getTodos(todoService.USER_ID)
      .then(allTodos => setTodosFromServer(allTodos))
      .catch(() => setErrorMesage(TodoError.load));
  }, []);

  const deleteTodo = (todoId: number) => {
    setSelectedTodoId(todoId);

    setTimeout(() => setTodosFromServer(
      todos.filter(todo => todo.id !== todoId),
    ), 300);

    return todoService.deleteTodo(String(todoId))
      .catch((error) => {
        setTodosFromServer(todos);
        setErrorMesage(TodoError.delete);
        throw error;
      }).finally(() => setSelectedTodoId(null));
  };

  return (
    <section className="todoapp__main">
      {
        todos.map(todo => (
          <div
            key={todo.id}
            className={classNames('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => setErrorMesage(TodoError.empty)}
              />
            </label>

            <span className="todo__title">{todo.title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>

            <div className={classNames(
              'modal',
              'overlay',
              {
                'is-active': todo.id === selectedTodoId
                  || todo.id === newAddedTodoId,
              },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))
      }
    </section>
  );
};
