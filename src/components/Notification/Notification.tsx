/* eslint-disable max-len */
export function Notification({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      {errorMessage}
    </div>
  );
}
