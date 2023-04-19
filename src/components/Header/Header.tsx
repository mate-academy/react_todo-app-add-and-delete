/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Submit } from '../../types/FormEvent';

interface Props {
  query: string;
  hasTodos: boolean;
  isActiveButton: boolean;
  isDisabledField: boolean;
  onSubmit: Submit;
  onChange: (value: string) => void;
}

export const Header: React.FC<Props> = ({
  query,
  hasTodos,
  isActiveButton,
  isDisabledField,
  onChange,
  onSubmit,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActiveButton },
        )}
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        value={query}
        disabled={isDisabledField}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={e => onChange(e.target.value)}
      />
    </form>
  </header>
);
