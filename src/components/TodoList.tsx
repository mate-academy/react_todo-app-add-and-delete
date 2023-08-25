import React, { MouseEventHandler, useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { GlobalContext } from '../context/GlobalContext';

type Props = {
  todos: Todo[];
};

const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo, deleteTodo } = useContext(GlobalContext);

  const onRemoveHandler = (id: number)
  : MouseEventHandler<HTMLButtonElement> | void => {
    deleteTodo(id);
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo !== null && (
        <div className={cn('todo', { completed: tempTodo.completed })}>
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemoveHandler(tempTodo.id)}
          >
            ×
          </button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

export default TodoList;
