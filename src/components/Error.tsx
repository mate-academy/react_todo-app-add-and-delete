/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect } from 'react';

type Props = {
  errorMessage: string,
  setErrorMessage: (x: string) => void,
};
export const Error: FC<Props> = ({ errorMessage, setErrorMessage }) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  });

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
      <br />
    </div>
  );
};
