import classNames from 'classnames';

type Props = {
  isActive?: boolean;
};

export const ModalOverlayComponent:React.FC<Props> = ({
  isActive = false,
}) => (
  <div
    className={classNames(
      'modal overlay',
      { 'is-active': isActive },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
