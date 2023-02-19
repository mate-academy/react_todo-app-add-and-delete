/* eslint-disable jsx-a11y/control-has-associated-label */
import { Error } from '../../types/ErrorMessage';

type Props = {
  onTodoTitle: string,
  onSetTodoTitle: (value: string) => void,
  newTitle: string,
  setError: (value: string) => void,
  postTodosToServer: (value: string) => void,
  isloading: boolean
};

export const Header: React.FC<Props> = ({
  onTodoTitle,
  onSetTodoTitle,
  newTitle,
  setError,
  postTodosToServer,
  isloading,
}) => {
  const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle === '') {
      setError(Error.Empty);
    }

    if (newTitle) {
      postTodosToServer(newTitle);
      onSetTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form
        onSubmit={onHandleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={onTodoTitle}
          onChange={(event) => onSetTodoTitle(event.target.value)}
          disabled={isloading}
        />
      </form>
    </header>
  );
};
