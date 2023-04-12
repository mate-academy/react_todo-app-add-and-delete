import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  onDelete?: (
    todoId: number,
    setIsDeleting: (isDeleting: boolean) => void,
  ) => void,
}

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => ( // delete
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        isActive={false}
        onDelete={onDelete}
      />
    ))}
  </section>
);
