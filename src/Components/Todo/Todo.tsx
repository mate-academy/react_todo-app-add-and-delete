import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';
import { TodoType } from '../../types/TodoType';

type Props = {
  todo: TodoType;
  removeTodo: (id: number) => Promise<void>;
  isNewTodo: boolean;
  isActiveDelComTodo?: boolean;
};

const Todo: React.FC<Props> = ({
  todo,
  removeTodo,
  isNewTodo,
  isActiveDelComTodo,
}) => {
  const [isEditTodo, setEditTodo] = useState(false);
  const [value, setValue] = useState(todo.title);
  const [isDelTodo, setDelTodo] = useState(false);

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const onDoubleClick = () => setEditTodo(true);
  const onBlur = () => setEditTodo(false);
  const onRemove = () => {
    setDelTodo(true);

    removeTodo(todo.id)
      .finally(() => setDelTodo(false));
  };

  return (
    <li
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      {isEditTodo
        ? (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={value}
              onChange={onChangeValue}
              onBlur={onBlur}
            />
          </form>
        ) : (
          <span
            className="todo__title"
            onDoubleClick={onDoubleClick}
          >
            {value.length
              ? value
              : todo.title}
          </span>
        )}

      <button
        type="button"
        className="todo__remove"
        onClick={onRemove}
      >
        ×
      </button>

      <div
        className={
          classNames(
            'modal',
            'overlay',
            {
              'is-active': (isNewTodo || isDelTodo)
                || (todo.completed && isActiveDelComTodo),
            },
          )
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};

export default Todo;
