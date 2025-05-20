type Props = {
  isActive?: boolean;
};

export const TodoLoader: React.FC<Props> = ({ isActive = false }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isActive ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
