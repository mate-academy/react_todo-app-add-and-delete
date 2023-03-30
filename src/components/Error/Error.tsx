import { useEffect, FC } from 'react';

type Props = {
  errorText: string,
  errorClear: () => void
};
export const Error: FC<Props> = ({ errorClear, errorText }) => {
  useEffect(() => {
    let idTimer: NodeJS.Timeout;

    if (errorText) {
      idTimer = setTimeout(errorClear, 3000);
    }

    return () => clearTimeout(idTimer);
  });

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={errorClear}
        aria-label="Закрити помилку"
      />
      {errorText}
    </div>
  );
};
