import { FormEvent, forwardRef } from 'react';
import classNames from 'classnames';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  onAddToto: (title: string) => void;
  isLoading: boolean;
  completedAllTodo: () => void;
  allCompleted: boolean;
};

type Ref = HTMLInputElement;

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header = forwardRef<Ref, Props>((props, ref) => {
  const {
    title,
    setTitle,
    onAddToto,
    isLoading,
    completedAllTodo,
    allCompleted,
  } = props;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddToto(title);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        onClick={completedAllTodo}
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={ref}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isLoading}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
});
