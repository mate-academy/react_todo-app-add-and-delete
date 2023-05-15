import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[];
  onTodoRemove: (todoId: number) => void;
  isRemCompleted: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoRemove,
  isRemCompleted,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onTodoRemove={onTodoRemove}
        isRemovingCompleted={isRemCompleted}
      />
    ))}
  </section>
);
