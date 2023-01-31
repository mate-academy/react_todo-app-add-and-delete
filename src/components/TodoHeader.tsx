/* eslint-disable jsx-a11y/control-has-associated-label */
import { memo } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
};

export const TodoHeader: React.FC<Props> = memo((props) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={props.newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
