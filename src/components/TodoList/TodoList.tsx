/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import React from "react";

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
        />
      ))}
    </section>
  );
};
