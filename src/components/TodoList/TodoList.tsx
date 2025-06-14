import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  deletingTodoId: number | null;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  deletingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isDeleting = todo.id === deletingTodoId;

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            isDeleting={isDeleting}
          />
        );
      })}
    </section>
  );
};
