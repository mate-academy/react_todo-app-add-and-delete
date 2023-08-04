import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { ErrorText } from '../../types/ErrorText';

type Props = {
  title: string,
  onSetTitle: (newTitle: string) => void,
  activeTodos: Todo[],
  onSubmit: () => void,
  onSetErrorMessage: (text: ErrorText) => void,
  disabledInput: boolean,
};

export const Header: React.FC<Props> = ({
  title,
  onSetTitle,
  activeTodos,
  onSubmit,
  onSetErrorMessage,
  disabledInput,
}) => {
  const handlerCreatedTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    onSetTitle(value);
  };

  const handlerSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.length < 1) {
      onSetErrorMessage(ErrorText.EmptyTitle);

      return;
    }

    onSubmit();
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="Select-all-or-Deselect-all"
        type="button"
        className={classNames(
          'todoapp__toggle-all', { active: activeTodos.length < 1 },
        )}
        onClick={() => { }}
      />

      <form onSubmit={handlerSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabledInput}
          value={title}
          onChange={handlerCreatedTitle}
        />
      </form>
    </header>
  );
};
