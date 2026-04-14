import './TodoErrorNotification.scss';
import { clsx } from 'clsx';
import { ErrorState } from '../../types/ErrorState';
import { useEffect } from 'react';

interface Props {
  errorState: ErrorState;
  onHide: (value: ErrorState) => void;
}

export const TodoErrorNotification = ({ errorState, onHide }: Props) => {
  useEffect(() => {
    let timer: number;

    if (errorState.isVisible) {
      timer = window.setTimeout(() => {
        onHide({
          ...errorState,
          isVisible: false,
        });
      }, 3000);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [errorState, onHide]);

  return (
    <div
      data-cy="ErrorNotification"
      className={clsx(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorState.isVisible,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onHide({ ...errorState, isVisible: false })}
      />
      {/* show only one message at a time */}
      {errorState.message}
      {/*Unable to load todos*/}
      {/*<br />*/}
      {/*Title should not be empty*/}
      {/*<br />*/}
      {/*Unable to add a todo*/}
      {/*<br />*/}
      {/*Unable to delete a todo*/}
      {/*<br />*/}
      {/*Unable to update a todo*/}
    </div>
  );
};
