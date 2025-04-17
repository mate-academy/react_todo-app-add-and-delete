import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  deleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  loadingTodoIds,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loadingTodoIds.includes(todo.id)}
          deleteTodo={deleteTodo}
        />
      ))}
      {tempTodo && <TodoItem key={'temp'} todo={tempTodo} loading={true} />}
    </section>
  );
};
