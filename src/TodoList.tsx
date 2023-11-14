/* eslint-disable no-lone-blocks */
import { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  deletingTodoId,
  tempTodo,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isDeleting={deletingTodoId === todo.id && isLoading}
          isLoading={isLoading}
          onDoubleClick={handleDoubleClick}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isLoading={isLoading}
          onDoubleClick={handleDoubleClick}
        />
      )}
    </section>
  );
};
