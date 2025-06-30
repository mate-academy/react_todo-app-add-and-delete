export const Loader = () => {
  return (
    <div className="loader" data-cy="loader">
      <div className="loader__spinner" />
      <span className="loader__text">Loading...</span>
    </div>
  );
};
