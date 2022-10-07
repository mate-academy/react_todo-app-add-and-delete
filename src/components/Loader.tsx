export const Loader: React.FC = () => (
  <div
    data-cy="TodoLoader"
    className="modal overlay is-active"
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader is-loading " />
  </div>
);
