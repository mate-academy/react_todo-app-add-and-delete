export const Loader = () => {
  return (
    <div
      data-cy="TodoLoader"
      className="
          overlay
          is-flex
          is-justify-content-center
          is-align-items-center
        "
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
