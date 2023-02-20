import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todoitem/Todoitem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isBeingAdded: boolean,
  onRemove: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isBeingAdded,
  onRemove,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onRemove={onRemove}
          isBeingAdded={isBeingAdded}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemove={onRemove}
          isBeingAdded={isBeingAdded}
        />
      )}
    </section>
  );
};
