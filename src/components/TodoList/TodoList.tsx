import cn from 'classnames';
import React from 'react';
import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';

type Props = {
  todosToShow: Todo[];
  changingTodosId: number | number[]
  onTodoAction: (todoId:number, state:boolean) => void
  onError: (errorTpye: ErrorType) => void
};

export const TodoList: React.FC<Props> = React.memo(({
  todosToShow,
  changingTodosId,
  onTodoAction,
  onError,
}) => {
  const onDeleteTodo = (todoId: number) => {
    onTodoAction(todoId, true);
    deleteTodo(todoId)
      .catch(() => {
        onError(ErrorType.DELETE);
      })
      .finally(() => {
        onTodoAction(todoId, false);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToShow.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              onDeleteTodo(todo.id);
            }}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn(
              'modal overlay',
              {
                'is-active': (typeof changingTodosId === 'number')
                  ? todo.id === changingTodosId
                  : (changingTodosId as number[]).includes(todo.id),
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
});
