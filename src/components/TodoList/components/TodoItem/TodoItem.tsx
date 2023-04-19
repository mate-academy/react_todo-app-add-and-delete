import classNames from 'classnames';
import { memo, FC } from 'react';
import { Todo } from '../../../../types/Todo';
import { Checkbox } from '../../../Checkbox';

interface Props {
  todo: Todo;
  loading?: boolean;
  handleRemoveTodo?: (todoId: number) => void;
}

export const TodoItem: FC<Props> = memo(({
  todo,
  loading,
  handleRemoveTodo = () => {},
}) => (
  <div className={classNames(
    'todo',
    { completed: todo?.completed },
  )}
  >
    <Checkbox
      checked={false}
      inputClassName="todo__status"
      labelClassName="todo__status-label"
      onChange={() => {}}
    />
    <span className="todo__title">
      {todo?.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      onClick={() => handleRemoveTodo(todo.id)}
    >
      ×
    </button>

    <div className={classNames(
      'modal overlay',
      { 'is-active': loading },
    )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
));
