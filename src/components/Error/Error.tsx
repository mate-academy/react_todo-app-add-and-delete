import { FC } from 'react';
import cn from 'classnames';
import { ErrorsType } from '../../types/ErrorsType';

interface Props {
  isError: boolean,
  onHide: () => void,
  errorType: ErrorsType,
}

export const Error: FC<Props> = ({
  isError,
  onHide,
  errorType,
}) => {
  /* const errorMessage= useMemo(() => {
    switch (errorType) {
      case errorType.
      default:
        return '';
    }
  }, [errorType]); */

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={onHide}
        aria-label="Close"
      />
      {errorType}
    </div>
  );
};
