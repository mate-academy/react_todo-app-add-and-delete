import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../context/TodosProvider';
import { deleteTodo } from '../../api/todos';
import { TodosError } from '../../types/TodosErrors';

interface Props {
  todo: Todo;
}

const TodoItem: FC<Props> = ({ todo }) => {
  const { title, completed, id } = todo;
  const { todosInProcess, setTodosInProcess, setTodos, handleErrorMessage } =
    useTodosContext();

  const removeTodo = (todoId: number) => () => {
    setTodosInProcess(prevIds => [...prevIds, todoId]);
    deleteTodo(todoId)
      .then(() => setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId)))
      .catch(handleErrorMessage(TodosError.DELETE_TODO))
      .finally(() =>
        setTodosInProcess(prevIds =>
          prevIds.filter(prevId => prevId !== todoId),
        ),
      );
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={removeTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todosInProcess.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
