import React, { useContext } from 'react';

import { TodoItem } from '../TodoItem/TodoItem';
import { TodoContext } from '../TodoContext';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} key={tempTodo.id} />
      )}
    </section>
  );
};
