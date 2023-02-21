import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  deleteTodo: (todoId: number) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => deleteTodo(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={() => deleteTodo(tempTodo.id)}
        />
      )}
    </section>
  );
};
