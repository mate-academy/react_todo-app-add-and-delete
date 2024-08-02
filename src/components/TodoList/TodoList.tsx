import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { useTodos } from '../../utils/TodoContext';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} isTemp />}
    </section>
  );
};
