import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todoitem/Todoitem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isBeingLoading: boolean,
  onRemove: (todoId: number) => void,
  idCheck : number,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isBeingLoading,
  onRemove,
  idCheck,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onRemove={onRemove}
          isBeingLoading={idCheck === todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemove={onRemove}
          isBeingLoading={isBeingLoading}
        />
      )}
    </section>
  );
};
