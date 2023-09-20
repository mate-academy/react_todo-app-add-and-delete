import { useContext } from 'react';
import { Todo } from '../Todo/Todo';
import { TodoContext } from '../../TodoContext';
import { Filter } from '../../types/Filter';
import { TodoType } from '../../types/TodoType';

export const TodoList = () => {
  const { todos, filterTodo, tempTodo } = useContext(TodoContext);

  const getFilteredList = (currentState: TodoType[]) => {
    switch (filterTodo) {
      case Filter.Active: {
        return currentState.filter(({ completed }) => !completed);
      }

      case Filter.Completed: {
        return currentState.filter(({ completed }) => completed);
      }

      default:
        return currentState;
    }
  };

  const filteredList = getFilteredList(todos);

  return (
    <>
      {filteredList.map(todo => (
        <Todo todo={todo} key={todo.id} />
      ))}
      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
