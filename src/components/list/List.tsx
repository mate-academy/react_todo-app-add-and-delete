import cn from 'classnames';
// import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { Error } from '../../types/Error';

type Props = {
  todoList: Todo[];
  setTodoList:(todos: Todo[]) => void,
  setError:(text: string) => void,
  setProcessings:(id: number | null) => void,
  processings:number[]
};

export const List: React.FC<Props> = ({
  todoList,
  setTodoList,
  setError,
  setProcessings,
  processings,
}) => {
  function onDeleteTodo(id: number) {
    setProcessings(id);
    deleteTodos(id)
      .then(() => setTodoList(todoList.filter((todo: Todo) => todo.id !== id)))
      .catch(() => setError(Error.Delete))
      .finally(() => setProcessings(null));
  }

  return (
    <section className="todoapp__main">

      { todoList.map((todo: Todo) => (
        <div
          className={cn('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <>
            <span
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>

          <div className={cn('modal overlay',
            {
              'is-active': processings?.includes(todo.id) || !todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

    </section>
  );
};
