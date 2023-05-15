import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  onChangeCompleted: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos, onChangeCompleted, onDelete,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        onChangeCompleted={onChangeCompleted}
        onDelete={onDelete}
        key={todo.id}
      />
    ))}
  </section>
);
