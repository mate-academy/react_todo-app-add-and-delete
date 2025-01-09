import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  handleDeleteTodo: (todoId: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loadingIds,
  handleDeleteTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <div>
      {[...todos, tempTodo]
        .filter((todo): todo is Todo => Boolean(todo))
        .map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            handleDeleteTodo={handleDeleteTodo}
          />
        ))}
    </div>
  </section>
);
