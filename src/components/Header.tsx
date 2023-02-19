/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Error } from '../types/Error';

type Props = {
  onTodoTitle: string
  onSetTodoTitle: (value: string) => void
  setError: (value: string) => void,
  onPostTodoFromServer: (value: string) => void,
  onIsLoading: boolean,
};

export const Header: React.FC<Props>
  = ({ onTodoTitle, onSetTodoTitle,
    setError,
    onPostTodoFromServer,
    onIsLoading,
  }) => {
    const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (onTodoTitle === '') {
        setError(Error.empty);

        return;
      }

      if (onTodoTitle) {
        onPostTodoFromServer(onTodoTitle);
        onSetTodoTitle('');
      }
    };

    return (
      <header className="todoapp__header">
        {/* this buttons is active only if there are some active todos */}
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        {/* Add a todo on form submit */}
        <form onSubmit={onHandleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={onIsLoading}
            value={onTodoTitle}
            onChange={(event) => onSetTodoTitle(event.target.value)}
          />
        </form>
      </header>

    );
  };
