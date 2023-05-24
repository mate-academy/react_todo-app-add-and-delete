import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  onRemove: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, onRemove }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem todo={todo} onRemove={onRemove} />
      ))}
    </section>
  );
};
