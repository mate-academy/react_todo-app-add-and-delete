import { FC } from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  onErrorClose: () => void;
}

/* eslint-disable jsx-a11y/control-has-associated-label */
export const ErrorMessage: FC<Props> = ({ error, onErrorClose }) => (
  <div
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !error,
    })}
  >
    <button
      type="button"
      className="delete"
      onClick={onErrorClose}
    />
    {error}
  </div>
);
