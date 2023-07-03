import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isLoadingTodo: number[],
  onRemoveTodo: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoadingTodo,
  onRemoveTodo,
}) => {
  return (
    <section className="todoapp__main">
      { todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          isLoadingTodo={isLoadingTodo}
          onRemoveTodo={onRemoveTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          isLoadingTodo={isLoadingTodo}
          onRemoveTodo={onRemoveTodo}
        />
      )}
    </section>
  );
};
