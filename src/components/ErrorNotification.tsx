/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import { CustomError } from '../types/CustomError';

type Props = {
  customError: CustomError,
  setError: (newError: CustomError, delay?: number) => void,
};

export const ErrorNotification: FC<Props> = ({ customError, setError }) => (
  <div
    className="notification is-danger is-light has-text-weight-normal"
    hidden={!customError}
  >
    <button
      type="button"
      className="delete"
      onClick={() => setError(CustomError.noError)}
    />

    <p>
      {customError}
    </p>
  </div>
);
