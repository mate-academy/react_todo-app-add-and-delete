import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  onDelete: (todoId: number) => void;
  deletingAllCompleted: boolean;
  todos: Todo[];
}

export const TodoList: React.FC<Props> = ({
  onDelete,
  deletingAllCompleted,
  todos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleting={deletingAllCompleted && todo.completed}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </section>
  );
};
