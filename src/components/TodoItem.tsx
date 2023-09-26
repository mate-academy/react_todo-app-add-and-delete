import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from './TodoProvider';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = (
  { todo }: Props,
) => {
  const [isItemLoading, setIsItemLoading] = useState(todo.id === 0);
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const todoTitleField = useRef<HTMLInputElement>(null);
  const {
    isLoadingMap,
    deleteTodoHandler,
    updateTodoHandler,
  } = useContext(TodoContext);

  const handleCheckboxChange = async () => {
    setIsItemLoading(true);
    await updateTodoHandler(todo, { completed: !todo.completed });
    setIsItemLoading(false);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsItemLoading(true);

    if (todoTitle !== todo.title) {
      await updateTodoHandler(todo, { title: todoTitle });
    } else if (todoTitle === todo.title) {
      setIsEditing(false);

      return;
    } else {
      await deleteTodoHandler(todo.id);
    }

    setIsEditing(false);
    setIsItemLoading(false);
  };

  const onTodoDelete = async () => {
    setIsItemLoading(true);
    await deleteTodoHandler(todo.id);
    setIsItemLoading(false);
  };

  useEffect(() => {
    if (isEditing && todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [isEditing]);

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          id={todo.title}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              ref={todoTitleField}
              data-cy="NewTodoField"
              type="text"
              className="todo__title-field"
              placeholder="Empty title will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              data-cy="TodoTitle"
              onDoubleClick={handleTodoDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onTodoDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': (isLoadingMap as { [key: number]: boolean })[todo.id]
              || isItemLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
