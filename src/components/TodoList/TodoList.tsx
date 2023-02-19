import cn from 'classnames';
import { useState } from 'react';
import { FilterState } from '../../types/FilterState';
import { TempTodo } from '../../types/tempTodo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterBy: FilterState,
  deleteTodosFromServer: (value: number) => void
  updateTodo: (value: Todo) => void
  tempTodo: TempTodo | null
  isloading: boolean
  deletingTodoId: number | null
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterBy,
  deleteTodosFromServer,
  updateTodo,
  tempTodo,
  isloading,
  deletingTodoId,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterState.Active:
        return !todo.completed;
      case FilterState.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const [isEditing] = useState(false);

  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <>
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo',
              { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  updateTodo({
                    ...todo,
                    completed: !todo.completed,
                  });
                }}
              />
            </label>

            {isEditing ? (
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={todo.title}
                />
              </form>
            ) : (
              <>
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
                  onClick={() => deleteTodosFromServer(todo.id)}
                >
                  ×
                </button>
              </>
            )}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': (isloading && todo.completed)
                || (deletingTodoId === todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </>
      ))}

      {tempTodo && (
        <>
          <div
            key={tempTodo.id}
            data-cy="Todo"
            className={cn('todo',
              { completed: tempTodo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
              />
            </label>

            {isEditing ? (
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={tempTodo.title}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                >
                  {tempTodo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => deleteTodosFromServer(tempTodo.id)}
                >
                  ×
                </button>
              </>
            )}

            {/* <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': isloading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div> */}
          </div>
        </>
      )}

    </section>
  );
};
