import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isTodoDeleting: boolean;
  selectedTodosId: number[];
  onDelete: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    isTodoDeleting,
    selectedTodosId,
    onDelete,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isTodoDeleting={isTodoDeleting}
          selectedTodosId={selectedTodosId}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          temporary
        />
      )}
    </section>
  );
};
