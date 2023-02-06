import classNames from 'classnames';

type Props = {
  editing: boolean
};

export const TodoModal: React.FC<Props> = ({ editing }) => (
  <div
    className={classNames(
      'modal overlay',
      { 'is-active': editing },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
