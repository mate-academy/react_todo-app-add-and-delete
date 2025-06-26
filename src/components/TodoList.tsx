import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  selectedTodoId: number | undefined;
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  selectedTodoId,
  deleteTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isLoading={selectedTodoId === todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isLoading={true} deleteTodo={deleteTodo} />
      )}
    </section>
  );
};
