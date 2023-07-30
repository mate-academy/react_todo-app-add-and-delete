import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  hideError: () => void;
  proccessedTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  hideError,
  proccessedTodoIds,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  return (
    <>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          hideError={hideError}
          isProcessing={proccessedTodoIds.includes(todo.id)}
        />
      ))}
    </>
  );
};
