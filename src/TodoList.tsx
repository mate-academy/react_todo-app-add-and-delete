import React, { useContext } from 'react';
import { TodoCard } from './TodoCard';
import { Todo } from './types/Todo';
import { TodosContext } from './TodoContext';

type Props = {
  visibleTodos: Todo[],
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
}) => {
  const { tempTodo } = useContext(TodosContext);

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {visibleTodos.map(todo => (
        <TodoCard
          currentTodo={todo}
          key={todo.id}
        />
      ))}

      {tempTodo !== null && tempTodo !== undefined && (
        <div
          className="todo"
          key={tempTodo.title}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
