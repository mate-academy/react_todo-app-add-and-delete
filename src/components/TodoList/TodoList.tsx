import React, { memo } from 'react';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isTodoDeleting: boolean;
  selectedTodosId: number[];
  removeTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempTodo,
    isTodoDeleting,
    selectedTodosId,
    removeTodo: onTodoDelete,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isTodoDeleting={isTodoDeleting}
          selectedTodosId={selectedTodosId}
          handleTodoDelete={onTodoDelete}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} temporary />}
    </section>
  );
});
