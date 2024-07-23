import { useContext, useEffect } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';
import classNames from 'classnames';

export const ErrorNotification: React.FC = () => {
  const { errorMessage } = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => dispatch({ type: 'showError', payload: null }), 3000);
    }
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
