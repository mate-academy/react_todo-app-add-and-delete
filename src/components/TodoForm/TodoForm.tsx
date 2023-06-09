/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

type Props = {
  amountActiveTodos: number,
  value: string,
  setValue: (value: string) => void,
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  isLoading: boolean,
};

export const TodoForm: React.FC<Props> = ({
  amountActiveTodos,
  value,
  setValue,
  handleAddTodo,
  isLoading,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        {
          active: !amountActiveTodos,
        },
      )}
    />

    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
      />
    </form>
  </header>
);
