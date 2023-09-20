/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { ApiErrorContext } from '../../Context';
import { RequestMethod } from '../../types/requestMethod';

type ResponseErrors = {
  [key in RequestMethod]: string;
};

const responseErrors: ResponseErrors = {
  GET: 'Unable to download todos',
  POST: 'Unable to add a todo',
  PATCH: 'Unable to update a todo',
  DELETE: 'Unable to delete a todo',
};

export const ApiError: React.FC = () => {
  const { apiError } = useContext(ApiErrorContext);
  const [addClassName, setAddClassName] = useState(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setAddClassName(true);
    }, 3000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, []);

  if (!apiError) {
    return null;
  }

  const errorMessage = apiError.message as RequestMethod;

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: addClassName,
      })}
    >
      <button
        type="button"
        className="delete"
        onClick={() => {
          setAddClassName(true);
        }}
      />
      {responseErrors[errorMessage]}
    </div>
  );
};
