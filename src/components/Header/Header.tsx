/* eslint-disable jsx-a11y/control-has-associated-label */
// import classNames from 'classnames';

type Props = {
  totalTodoListLength: number,
};

export const Header: React.FC<Props> = ({ totalTodoListLength }) => {
  return (
    <header className="todoapp__header">
      {totalTodoListLength !== 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
