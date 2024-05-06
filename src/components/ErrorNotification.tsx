import { useMemo } from 'react';
import { ErrorStatesType } from '../types/ErrorMessage';

const failMsgs = {
  todoLoad: 'Unable to load todos',
  titleLength: 'Title should not be empty',
  addTodo: 'Unable to add a todo',
  deleteTodo: 'Unable to delete a todo',
  updateTodo: 'Unable to update a todo',
};

type Props = {
  failCaseStates: {};
  changeErrorState: (
    newVal: boolean,
    errName?: keyof ErrorStatesType | 'all',
  ) => void;
};

export default function ErrorNotification({
  failCaseStates,
  changeErrorState,
}: Props) {
  const currentFailCase = useMemo(() => {
    const singleFail = Object.entries(failCaseStates).filter(fCase => fCase[1]);

    if (singleFail.length === 0) {
      return null;
    } else {
      setTimeout(() => {
        changeErrorState(false, singleFail[0][0] as keyof typeof failMsgs);
      }, 3000);

      return failMsgs[singleFail[0][0] as keyof typeof failMsgs];
    }
  }, [failCaseStates, changeErrorState]);

  function handleHideMsg() {
    changeErrorState(false);
  }

  /* DON'T use conditional rendering to hide the notification */
  /* Add the 'hidden' class to hide the message smoothly */
  return (
    <div
      data-cy="ErrorNotification"
      className={
        'notification is-danger is-light has-text-weight-normal ' +
        (currentFailCase === null ? 'hidden' : '')
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideMsg}
      />
      {currentFailCase}
    </div>
  );
}
