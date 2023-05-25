import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  onRemove: (id: number) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({ todos, onRemove, tempTodo }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem todo={todo} onRemove={onRemove} />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} onRemove={onRemove} />
      )}
    </section>
  );
};
