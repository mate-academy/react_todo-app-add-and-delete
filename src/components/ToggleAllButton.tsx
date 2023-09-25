import classNames from 'classnames';

type Props = {
  active: boolean;
};

export const ToggleAllButton: React.FC<Props> = ({ active }) => (
  <button
    type="button"
    aria-label="Toggle All"
    data-cy="ToggleAllButton"
    className={classNames('todoapp__toggle-all', { active })}
  />
);
