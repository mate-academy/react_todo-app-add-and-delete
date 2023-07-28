import React, { useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/todo.context';

type TodoListItemProps = {
  todo: Todo,
};
const TodoListItem:React.FC<TodoListItemProps> = ({ todo }) => {
  const { loadingTodo, removeTodo, selectedTodoIds } = useContext(TodoContext);

  return (
    <div className={cn('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={cn('modal overlay', {
        'is-active': todo.id === loadingTodo?.id
          || selectedTodoIds.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoListItem;
