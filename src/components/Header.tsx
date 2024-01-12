import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { ErrorType, Todo } from '../types';
import { postTodo } from '../api/todos';

type Props = {
  activeTodos: number;
  setErrorMessage: (newMessage: ErrorType | null) => void;
  userId: number;
  handleTodoAdded: (todo: Todo) => void;
  handleAddTempTodo: (todo: Todo) => void;
  handleRemoveTempTodo: () => void;
};

export const Header: React.FC<Props> = ({
  activeTodos,
  setErrorMessage,
  userId,
  handleTodoAdded,
  handleAddTempTodo,
  handleRemoveTempTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputTitle, setInputTitle] = useState('');
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setInputTitle(event.target.value);
  };

  const handleSubmitChanges = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = inputTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorType.TITLE);
    } else {
      setDisabled(true);

      handleAddTempTodo({
        id: 0,
        userId,
        title: inputTitle,
        completed: false,
      });

      postTodo({ userId, title: inputTitle, completed: false })
        .then((response) => {
          handleTodoAdded({
            id: response.id,
            userId: response.userId,
            title: response.title,
            completed: response.completed,
          });
        })
        .catch(() => setErrorMessage(ErrorType.ADD))
        .finally(() => {
          setDisabled(false);
          setInputTitle('');
          handleRemoveTempTodo();
        });
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: activeTodos,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmitChanges}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
          ref={inputRef}
          value={inputTitle}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
