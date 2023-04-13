import { FC } from 'react';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  error: ErrorType,
  onClose: () => void,

}

export const ErrorModal: FC<Props> = (props) => {
  const { error, onClose } = props;

  return (
    <div className="modal is-active is-danger">
      <div className="modal-background" />

      <div className="modal-content">
        <div className="box has-background-danger-light">
          <p className="has-text-danger-dark has-text-centered">
            {error}
            <button
              type="button"
              className="delete is-pulled-right"
              onClick={onClose}
              aria-label="close the modal"
            />
          </p>
        </div>
      </div>
    </div>

  );
};
