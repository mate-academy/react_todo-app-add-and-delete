import {FC, useContext } from 'react';
import classNames from 'classnames/bind';
import {AppTodoContext} from '../AppTodoContext/AppTodoContext';
import {ErrorType} from './Error.types';

export const Error: FC = () => {
  const { errorMessage, setErrorMessage } = useContext(AppTodoContext);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === ErrorType.NoError as string },
      )}
    >
      <button
        aria-label="close button"
        value=""
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage(ErrorType.NoError);
        }}
      />

      {[errorMessage]}

    </div>
  );
};
