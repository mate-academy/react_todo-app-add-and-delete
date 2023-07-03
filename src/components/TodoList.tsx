import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
}

export const TodoList:FC<Props> = ({ todos, tempTodo }) => {
  return (
    <section className="todoapp__main">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={false}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
        />
      )}
    </section>
  );
};
