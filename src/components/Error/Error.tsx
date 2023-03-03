import { useEffect, FC } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  errorText: string,
  errorClear: () => void
};
export const Error: FC<Props> = ({ errorClear, errorText }) => {
  useEffect(() => {
    const idTimer = setTimeout(errorClear, 3000);

    if (errorText) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      idTimer;
    }

    return () => clearTimeout(idTimer);
  });

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button type="button" className="delete" onClick={errorClear} />
      {errorText}
    </div>
  );
};
