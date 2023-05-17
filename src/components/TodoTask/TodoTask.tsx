import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { removeTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  onChangeTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  onChangeError: React.Dispatch<React.SetStateAction<ErrorType>>
  isLoading: boolean;
  onChangeProcessing: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoTask: FC<Props> = ({
  todo,
  isLoading,
  onChangeTodos,
  onChangeError,
  onChangeProcessing,
}) => {
  const handleRemoveTodo = async () => {
    try {
      onChangeProcessing(prev => [...prev, todo.id]);
      await removeTodo(todo.id);
      onChangeTodos(prev => prev.filter(item => item.id !== todo.id));
    } catch {
      onChangeError(ErrorType.Delete);
    } finally {
      onChangeProcessing(prev => prev.filter(item => item !== todo.id));
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <>
        <span className="todo__title">{todo.title}</span>
        <button
          type="button"
          className="todo__remove"
          onClick={handleRemoveTodo}
        >
          ×
        </button>
      </>

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
