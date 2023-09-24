import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodosCount: number,
  onSubmit: (todo: Todo) => void,
  todo?: Todo | null,
  userId: number,
  tempTodo: Todo | null,
  isLoading: boolean,
  errorMessage: string,
};

export const TodoHeader: React.FC<Props> = ({
  activeTodosCount,
  onSubmit,
  todo,
  userId,
  tempTodo,
  errorMessage,
}) => {
  const [title, setTitle] = useState(tempTodo?.title || '');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setTitle(newTitle);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const id = todo?.id || 0;

    onSubmit({
      id,
      title,
      completed: false,
      userId,
    });

    setTitle('');
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {activeTodosCount && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* {tempTodo && isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )} */}

      <form
        onSubmit={handleSubmit}
        method="Post"
        action="/api/posts"
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className={classNames('todoapp__new-todo', {
            'is-danger': errorMessage,
          })}
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          value={title}
          // disabled={isLoading}
        />
        {/* {hasTitleError && (
          <p
            className="error-message"
          >
            Title cannot be empty or contain only whitespace
          </p>
        )} */}
      </form>
    </header>
  );
};
