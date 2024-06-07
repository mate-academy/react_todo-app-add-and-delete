import React from 'react';

import { TodoListType } from '../../types/TodoListType';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC<TodoListType> = ({ todos, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && <TodoItem tempTodo={tempTodo} todo={tempTodo} />}
    </section>
  );
};
