import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
  tempTodo: Todo | null,
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  loadingTodoId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            loading={loadingTodoId === todo.id}
          />
        ))}

        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            loading
          />
        )}
      </ul>
    </section>
  );
};
