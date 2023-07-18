/* eslint-disable jsx-a11y/control-has-associated-label */
import { ResponseError } from '../../types/enum';

type Props = {
  respError: ResponseError;
  setRespError: (arg: ResponseError) => void;
};

export const Notification: React.FC<Props> = ({ respError, setRespError }) => {
  if (respError !== ResponseError.NOT) {
    setTimeout(() => setRespError(ResponseError.NOT), 3000);
  }

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => setRespError(ResponseError.NOT)}
      />
      {respError === ResponseError.ADD && 'Unable to add a todo'}
      {respError === ResponseError.DELETE && 'Unable to delete a todo'}
      {respError === ResponseError.UPDATE && 'Unable to update a todo'}
      {respError === ResponseError.EMPTY && "Title can't be empty"}
    </div>

  );
};
