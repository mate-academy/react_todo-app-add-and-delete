import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  onTodoDelete: (todoId: number) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({ todos, onTodoDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={async () => onTodoDelete(todo.id)}
        />
      ))}
    </section>
  );
};
