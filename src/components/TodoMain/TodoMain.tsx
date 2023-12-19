import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  selectedTodoIds: number[],
  onDelete: (todoId: number) => void,
};

export const TodoMain: React.FC<Props> = ({
  todos,
  tempTodo,
  selectedTodoIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            selectedTodoIds={selectedTodoIds}
            onDelete={onDelete}
            key={todo.id}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          selectedTodoIds={selectedTodoIds}
          onDelete={() => {}}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
