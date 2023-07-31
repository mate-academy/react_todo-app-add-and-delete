/*eslint-disable*/
import classnames from "classnames";

import React, { useContext, useEffect } from "react";
import { TodosContext } from "../../context/TodosContext";

export const ErrorComponent: React.FC = () => {
  const { error, onCloseError } = useContext(TodosContext);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      onCloseError();
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [error]);

  return (
    <div
      className={classnames({
        "notification is-danger is-light has-text-weight-normal": true,
        hidden: !error,
      })}
    >
      <button type="button" className="delete" onClick={() => onCloseError()} />
      {error}
    </div>
  );
};
