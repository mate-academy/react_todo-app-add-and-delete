import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({ todos, deleteTodo, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          deleteTodo={deleteTodo}
        />
      )}
    </section>
  );
};
