// import React, { useState } from 'react';

import classNames from 'classnames';

type Props = {
  // error: boolean
  removeError: (boolean: boolean) => void
  closeError: boolean
  // title: string
  // titleError: boolean
  // setTitleError:(boolean: boolean)=> void
  errorMessage: string | null
};

// можно оставить тип ошибок для урл а для тайтла свою сделать
// и тут через тернарник выводить
export const ErrorNotification: React.FC<Props> = ({
  closeError,
  removeError,
  errorMessage,
}) => {
  // console.log(title);
  // console.log(closeError);
  // console.log(errorMessage);

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames('notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal', {
            // hidden: !error,
            hidden: !closeError,
            // hidden: errorUrl,
          })}

      >
        <button
          aria-label="press button to delete"
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          // onClick={() => closeError(false)}
          // onClick={() => removeError(true)}
          onClick={() => removeError(false)}
        />

        {/* не трогаю переключатель иконки и класса просто при вводе и загрузки или удалении буду разные сообщения показывать */}
        {/* так мне не придется делать два отдельных сооющения об ошибке */}
        {/* Wrong url */}
        {errorMessage}
      </div>

    </>
  );
};
