import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodos: Todo[];
  loadingTodoIds: number[];
  tempTodo: null | Todo;
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  loadingTodoIds,
  tempTodo,
  onRemoveTodo,
  onUpdateTodo,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          inEditedMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading
          setEditedTodoId={setEditedTodoId}
        />
      )}
    </section>
  );
};
