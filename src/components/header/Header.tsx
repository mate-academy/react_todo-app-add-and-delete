import { NewTodo } from '../newTodo/NewTodo';
import classNames from 'classnames';

type Props = {
  toggleAll: number;
  addPost: (title: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shouldFocus: boolean;
};

export const Header: React.FC<Props> = ({
  toggleAll,
  addPost,
  setError,
  shouldFocus,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: !toggleAll })}
        data-cy="ToggleAllButton"
      />

      <NewTodo
        handleAdd={addPost}
        setError={setError}
        shouldFocus={shouldFocus}
      />

      {/* Add a todo on form submit */}
    </header>
  );
};
