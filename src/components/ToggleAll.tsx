/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import classNames from 'classnames';

interface Props {
  onToggleAll: () => void,
  allCompleted: boolean,
}

// eslint-disable-next-line max-len
export const ToggleAll: React.FC<Props> = ({
  onToggleAll,
  allCompleted,
}) => {
  return (
    <button
      type="button"
      className={
        classNames('todoapp__toggle-all', {
          active: allCompleted,
        })
      }
      onClick={onToggleAll}
    />
  );
};
