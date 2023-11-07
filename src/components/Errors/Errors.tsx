import cn from 'classnames';
import { TodosContext } from "../../components/TodosProvider";
import { useContext } from "react";


export const Errors: React.FC = () => {
  const {
    todosError,
    isShowErrors,
    setIsShowErrors,
  } = useContext(TodosContext);
  setTimeout(() => {
    setIsShowErrors(false);
    console.log("hide errors")
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isShowErrors,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsShowErrors(false)}
        aria-label="HideErrorButton"
      />
      {/* show only one message at a time */}
      {todosError}
    </div>
  );
};
