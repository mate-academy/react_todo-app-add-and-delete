import classNames from 'classnames';

type Props = {
  isAllCompleted: boolean;
};

export const ToggleAllButton: React.FC<Props> = ({ isAllCompleted }) => {
  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: isAllCompleted,
      })}
      data-cy="ToggleAllButton"
    />
  );
};
