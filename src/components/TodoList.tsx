import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
  onToggle: (id: number) => void,
  loadingTodoId: number,
};

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, onDelete, onToggle, loadingTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading={loadingTodoId === todo.id}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading
        />
      )}
    </section>
  );
};
