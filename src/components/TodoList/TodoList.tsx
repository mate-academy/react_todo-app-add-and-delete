import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null;
  hasLoadedTodos: number[];
  handleRemoveTodo: (id: number) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  hasLoadedTodos,
  handleRemoveTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadedId={hasLoadedTodos.includes(todo.id)}
          onDeleteTodo={handleRemoveTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadedId
          onDeleteTodo={handleRemoveTodo}
        />
      )}
    </section>
  );
};
