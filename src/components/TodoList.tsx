import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null;
  handleDeleteTodo: (todo: Todo) => void,
  toggleTodo: (todo: Todo) => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  toggleTodo,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          toggleTodo={toggleTodo}
        />
      ))}
    </section>
  );
};
