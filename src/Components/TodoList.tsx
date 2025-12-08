/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
};

const TodoListComponent: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoading = loadingIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            selectedTodoId={selectedTodoId}
            isLoading={isLoading}
            onSelect={setSelectedTodoId}
          />
        );
      })}

      {tempTodo && (
        <TodoItem todo={tempTodo} key={tempTodo.id} isLoading={true} />
      )}
    </section>
  );
};

export const TodoList = React.memo(TodoListComponent);
