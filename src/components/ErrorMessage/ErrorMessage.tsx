/* eslint-disable jsx-a11y/control-has-associated-label */

import { memo } from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType,
  setError: React.Dispatch<React.SetStateAction<ErrorType>>,
};

export const ErrorMessage: React.FC<Props> = memo(({ error, setError }) => (
  <div
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: error === ErrorType.NONE,
    })}
  >
    <button
      type="button"
      className="delete"
      onClick={() => setError(ErrorType.NONE)}
    />
    {error}
  </div>
));
