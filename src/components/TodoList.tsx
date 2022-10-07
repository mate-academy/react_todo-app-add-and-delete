import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  onDeleteTodo: (value: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  onDeleteTodo,
}) => {
  const tempTodo = {
    id: 0,
    title: '',
    completed: false,
    userId: 0,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isAdding={isAdding}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
      {isAdding && (
        <TodoItem
          todo={tempTodo}
          isAdding={isAdding}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </section>
  );
};
