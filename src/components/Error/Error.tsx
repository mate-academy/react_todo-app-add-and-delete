import { FC } from 'react';
import cn from 'classnames';

interface Props {
  isError: boolean,
  onHide: () => void,
}

export const Error: FC<Props> = ({
  isError,
  onHide,
}) => {
  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={onHide}
        aria-label="Close"
      />
      Unable to add a todo
    </div>
  );
};
