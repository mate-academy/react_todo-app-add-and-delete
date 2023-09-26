/* eslint-disable */
import { Todo } from "../types/Todo";
import classNames  from "classnames";
import { deleteTodo, getTodos } from "../api/todos";
import { ACTIONS } from "../utils/enums";
import { StateContext } from "./TodoContext";
import { useContext } from "react";

type Props = {
  todo: Todo,
}
export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { dispatch } = useContext(StateContext);

  function deleteItem(id: number) {
    deleteTodo(id)
    .then(() => {
      getTodos(11384)
      .then(res => {
        dispatch({ type: ACTIONS.SET_LIST, payload: res })
      })
    })
    .catch(() => dispatch({ type: ACTIONS.SET_ERROR, payload: 'Unable to delete a todo' }))


  }

  return (
    <div className={classNames('todo',{
      'completed': todo.completed
    })}>
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
      />
    </label>

    <span className="todo__title">{todo.title}</span>

    {/* Remove button appears only on hover */}
    <button
    type="button"
    className="todo__remove"
    onClick={() => deleteItem(todo.id)}
    >

    ×</button>

    {/* overlay will cover the todo while it is being updated */}
    <div className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
  )
}


