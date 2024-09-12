import React from 'react';
import { TodoItem } from '../TodoItem';
import { useTodos } from '../TodosProvider';

export const TodoList: React.FC = React.memo(function TodoList() {
  const { filteredTodos, tempTodo } = useTodos();

  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem key={tempTodo?.id} todo={tempTodo} />}
    </>
  );
});
