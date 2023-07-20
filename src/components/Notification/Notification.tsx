/* eslint-disable jsx-a11y/control-has-associated-label */
import { ResponseError } from '../../types/enum';

type Props = {
  error: ResponseError;
  setError: (arg: ResponseError) => void;
};

export const Notification: React.FC<Props> = ({ error, setError }) => {
  if (error !== ResponseError.NOT) {
    setTimeout(() => setError(ResponseError.NOT), 3000);
  }

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => setError(ResponseError.NOT)}
      />
      {error}
    </div>
  );
};
