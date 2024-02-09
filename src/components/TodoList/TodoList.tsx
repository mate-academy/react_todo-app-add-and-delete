import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';
import { TodoContext } from '../../Context/TodoContext';

type Props = {
  filteredTodos: Todo[]
};

export const TodoList: React.FC<Props> = ({ filteredTodos }) => {
  const { tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todoInfo={todo} />
      ))}
      {tempTodo && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div
            data-cy="TodoLoader"
            className="modal overlay is-active"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
