import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  // completed: boolean;
  // id: number;
  // title: string;
  todo: Todo;
  handleEditTodo: (id: number, comleted: boolean) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<void>;
  // isCompleted: boolean;
  isAdding: boolean;
  isLoading: number[];
  handleEditTitle: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  // completed,
  // id,
  // title,
  todo,
  handleEditTodo,
  handleDeleteTodo,
  // isCompleted,
  isAdding,
  isLoading,
  handleEditTitle,
}) => {
  const { completed, id, title } = todo;
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  const newTitleField = useRef<HTMLInputElement>(null);

  const isLoadingFinished = useMemo(
    () => isLoading.includes(id) || (isAdding && !todo.id),
    [isLoading, isAdding],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (title === newTitle.trim()) {
        setIsDoubleClicked(false);
        setNewTitle(newTitle.trim());
      }

      if (!newTitle.trim()) {
        handleDeleteTodo(id);
      }

      setIsDoubleClicked(false);
      handleEditTitle(id, newTitle.trim());
    },
    [newTitle, title],
  );

  const handleKeyboardEvent = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setIsDoubleClicked(true);
    }

    if (event.key === 'Escape') {
      setIsDoubleClicked(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    if (newTitleField.current) {
      newTitleField.current.focus();
    }
  }, [isDoubleClicked]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed })} key={id}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleEditTodo(id, !completed)}
        />
      </label>
      {isDoubleClicked ? (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={newTitleField}
            value={newTitle}
            onKeyDown={handleKeyboardEvent}
            onChange={(event) => {
              setNewTitle(event.target.value);
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDoubleClicked(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}
      {/* <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button> */}
      {isLoadingFinished && (
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': isLoadingFinished })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
      {/* <div data-cy="TodoLoader" className="modal overlay">

      <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div> */}
    </div>
  );
};
