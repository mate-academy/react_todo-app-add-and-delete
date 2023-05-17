import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
}) => (
  <section className="todoapp__main">
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
