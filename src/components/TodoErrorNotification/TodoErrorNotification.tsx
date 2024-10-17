import { FC } from 'react';
import cn from 'classnames';
import './TodoErrorNotification.scss';
import { ErrorMessages } from '../../types';

interface Props {
  errorMessage: ErrorMessages;
  onResetErrorMessage: () => void;
}

export const TodoErrorNotification: FC<Props> = ({
  errorMessage,
  onResetErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !errorMessage,
    })}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onResetErrorMessage}
    />
    {errorMessage}
  </div>
);
