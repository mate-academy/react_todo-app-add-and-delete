import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} handleDelete={handleDelete} />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} handleDelete={handleDelete} />}
    </section>
  );
};
