import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDeleteBtn: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteBtn,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteBtn={onDeleteBtn}
        />
      ))}
    </section>
  );
};
