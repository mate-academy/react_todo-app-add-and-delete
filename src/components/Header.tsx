import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  titleInputRef: React.RefObject<HTMLInputElement>;
  isUpdating: boolean;
  isToggleAllActive: boolean;
  onSubmit: () => void;
};

export const Header: React.FC<Props> = ({
  isToggleAllActive,
  onSubmit = () => {},
  isUpdating,
  titleInputRef,
}) => {
  useEffect(() => {
    titleInputRef?.current?.focus();
  }, [titleInputRef, isUpdating]);

  const handleSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    onSubmit();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isToggleAllActive,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleInputRef}
          disabled={isUpdating}
        />
      </form>
    </header>
  );
};
