import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  tempTodo,
  deletingTodoIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {isLoading && (
        <div data-cy="Todo" className="todo">
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={deletingTodoIds.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} isProcessed />}
    </section>
  );
};
