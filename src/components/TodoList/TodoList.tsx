import { FC, useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { ErrorProvider } from '../../context/TodoError';
import { waitToClose } from '../../utils/hideErrorWithDelay';

type TTodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  hasDeleteTodoErrorTimerId: { current: number };
  deletedTodoIds: number[];
  inputFieldRef: { current: HTMLInputElement | null };
  setDeletedTodoIds: (callblack: (prev: number[]) => number[]) => void;
  setTodos: (callblack: (prev: Todo[]) => Todo[]) => void;
};

export const TodoList: FC<TTodoListProps> = ({
  todos,
  setTodos,
  hasDeleteTodoErrorTimerId,
  tempTodo,
  setDeletedTodoIds,
  deletedTodoIds,
  inputFieldRef,
}) => {
  const { setError } = useContext(ErrorProvider);

  const handleDeleteBtn = (todoId: number) => {
    (async () => {
      try {
        setDeletedTodoIds(prevTodos => [...prevTodos, todoId]);
        await deleteTodo(todoId);

        if (inputFieldRef.current) {
          inputFieldRef.current.focus();
        }

        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch (deleteError) {
        // eslint-disable-next-line no-console
        console.warn(deleteError);
        setDeletedTodoIds(() => []);
        setError(prev => ({
          ...prev,
          message: 'Unable to delete a todo',
          hasError: true,
        }));
        // eslint-disable-next-line no-param-reassign
        hasDeleteTodoErrorTimerId.current = waitToClose(3000, setError);
      }
    }
    )();
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteBtn(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div
            data-cy="TodoLoader"
            className={cn('modal', 'overlay', {
              'is-active': deletedTodoIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className={cn('todo', {
            completed: tempTodo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
