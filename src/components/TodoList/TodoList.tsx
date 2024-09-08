import { Todo } from '../../types/Todo';
import React from 'react';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onDeleteTodo={onDeleteTodo} />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </section>
  );
};
