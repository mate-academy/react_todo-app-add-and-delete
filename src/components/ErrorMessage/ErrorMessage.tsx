import { Error } from '../../enums/Error';

type Props = {
  setError: (value: Error) => void;
  ErrorTitle: string
};

export const ErrorMessage: React.FC<Props> = ({ setError, ErrorTitle }) => {
  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        aria-label="reset Error"
        className="delete"
        onClick={() => setError(Error.RESET)}
      />
      {ErrorTitle}
    </div>
  );
};
