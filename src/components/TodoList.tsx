import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  deleteTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDelete={deleteTodo}
            deleteTodoId={deleteTodoId}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={deleteTodo}
          deleteTodoId={deleteTodoId}
        />
      )}
    </section>
  );
};
