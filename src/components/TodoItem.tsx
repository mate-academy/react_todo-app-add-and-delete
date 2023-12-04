import cn from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';
import { removeTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { TodosContext } from '../TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos,
    setTodos,
    setErrorMassage,
    setIsDeleting,
    isDeleting,
  } = useContext(TodosContext);
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditin, setIsEditing] = useState(false);

  const deleteTodo = () => {
    setIsDeleting(true);
    removeTodo(id)
      .then(() => {
        setTodos(currTodos => currTodos.filter(td => td.id !== id));
      })
      .catch(() => setErrorMassage(ErrorType.DELETE_ERROR))
      .finally(() => {
        setTimeout(() => setErrorMassage(ErrorType.NO_ERROR), 3000);
        setIsDeleting(false);
      });
  };

  const edit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTitle(title);
    setNewTitle(e.target.value);
  };

  const submit = () => {
    setIsEditing(false);
  };

  const handleComplete = (todoId: number) => {
    const newTodos = todos?.map(td => (
      td.id === todoId
        ? { ...td, completed: !td.completed }
        : { ...td }
    ));

    if (newTodos) {
      setTodos(newTodos);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
      onDoubleClick={() => setIsEditing(true)}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          // checked={completed}
          onClick={() => handleComplete(id)}
        />
      </label>

      {isEditin ? (
        <form onSubmit={submit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={edit}
            onBlur={submit}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
          >
            x
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      {(id === 0 || isDeleting) && (
        <TodoLoader />
      )}
    </div>
  );
};
