/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string,
  onCloseBtnClick: () => void,
};

export const ErrorMessage: FC<Props> = ({
  errorMessage,
  onCloseBtnClick,
}) => (
  <div
    data-cy="ErrorMessage"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorMessage },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onCloseBtnClick}
    />
    {errorMessage}
  </div>
);
