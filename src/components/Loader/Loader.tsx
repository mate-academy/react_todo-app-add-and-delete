type Props = {
  isActive?: boolean;
};

export const Loader: React.FC<Props> = ({ isActive = false }) => (
  <div
    data-cy="TodoLoader"
    className={`modal overlay ${isActive ? 'is-active' : ''}`}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
