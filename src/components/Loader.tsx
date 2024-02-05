import React, { useContext } from "react";
import classNames from "classnames";
import { TodoContext } from "../context/TodoContext";

interface Props {
  id: number;
}

export const Loader: React.FC<Props> = ({ id }) => {
  const { deletedId } = useContext(TodoContext);

  return (
    <div 
      data-cy="TodoLoader" 
      className={classNames('modal overlay', {
        'is-active': deletedId.includes(id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};