import { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  preparedTodos: Todo[],
  tempTodo: Todo | null,
  deleteCurrentTodo: (todoId: number) => Promise<void>,
  onDeleteIds: number[] | null,
  setOnDeleteIds: React.Dispatch<React.SetStateAction<number[] | null>>,
};

export const TodoList: React.FC<Props> = memo(({
  preparedTodos,
  tempTodo,
  deleteCurrentTodo,
  onDeleteIds,
  setOnDeleteIds,
}) => {
  const handleClick = (todoId: number) => {
    setOnDeleteIds([todoId]);

    deleteCurrentTodo(todoId)
      .finally(() => setOnDeleteIds(null));
  };

  return (
    <section className="todoapp__main">
      {preparedTodos.map(todo => (
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
              defaultChecked={todo.completed}
            />
          </label>

          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleClick(todo.id)}
          >
            ×
          </button>

          <div
            className={cn('modal overlay', {
              'is-active': onDeleteIds?.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {!!tempTodo && (
        <>
          <div className="todo">
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>

        </>
      )}
    </section>
  );
});
