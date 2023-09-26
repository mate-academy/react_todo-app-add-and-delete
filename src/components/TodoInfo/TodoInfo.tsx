import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
// import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../../TodosContext';
// import { ErrorMessage } from '../../types/errorMessage';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const {
    // setTodos, todos, errorNotificationHandler,
    isLoading, todosIdsUpdating, deletingTodoHandler,
  } = useContext(TodosContext);
  const [isEditing] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [isSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  // const onDeleteHandler = () => {
  //   setIsLoading(true);
  //   deleteTodo(todo.id)
  //     .then(() => setTodos(todos.filter(currTodo => currTodo.id !== todo.id)))
  //     .catch(() => errorNotificationHandler(ErrorMessage.DELETE))
  //     .finally(() => setIsLoading(false));
  // };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => setIsCompleted(!isCompleted)}
        />
      </label>

      {isEditing && !isLoading
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              data-cy="TodoTitleField"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              data-cy="TodoTitle"
            >
              {isSaving
                ? 'Todo is being saved now'
                : todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deletingTodoHandler(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todosIdsUpdating.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
