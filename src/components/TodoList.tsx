import React from 'react';
import { TodoItem } from './TodoItem';

import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  deleteId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  deleteId,
}) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteId={deleteId}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
};
