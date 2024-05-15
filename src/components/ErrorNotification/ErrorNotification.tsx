import { FC, useContext, useEffect } from 'react';

import { errors } from '../../constants';

import { AppContext } from '../../wrappers/AppProvider';

export const ErrorNotification: FC = () => {
  const { errorType, setErrorType } = useContext(AppContext);

  const errorMessage = errorType ? errors[errorType].message : '';

  useEffect(() => {
    if (errorType) {
      setTimeout(() => {
        setErrorType(null);
      }, 3000);
    }
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorType ? 'hidden' : ''}`}
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorType(null)}
      />
    </div>
  );
};
