import { Todo } from '../types/Todo';
import React from 'react';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todo: Todo) => void;
  onUpdateTitleTodo: (todo: Todo) => void;
  loading: boolean;
  isSubmitting: boolean;
  deletedIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onUpdateTodo,
  onUpdateTitleTodo,
  isSubmitting,
  deletedIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* {loading && <div className="loader" />} */}

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          onUpdate={() => onUpdateTodo(todo)}
          onUpdateTitle={onUpdateTitleTodo}
          loading={deletedIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loading={true}
          onDelete={onDeleteTodo}
          onUpdate={() => onUpdateTodo(tempTodo)}
          onUpdateTitle={onUpdateTitleTodo}
        />
      )}
      {isSubmitting && <div className="loader" />}
    </section>
  );
};
