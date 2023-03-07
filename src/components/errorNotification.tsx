/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classnames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  onNotificationClose: () => void,
  isErrorOccuring: boolean,
  errorTypeToShow: ErrorType,
};
export const ErrorNotification: React.FC<Props> = ({
  onNotificationClose,
  isErrorOccuring,
  errorTypeToShow,
}) => {
  return (
    <div className={classnames('notification', 'is-danger',
      'is-light', 'has-text-weight-normal', { hidden: !isErrorOccuring })}
    >
      <button
        type="button"
        className="delete"
        onClick={onNotificationClose}
      />
      {errorTypeToShow}
    </div>
  );
};
