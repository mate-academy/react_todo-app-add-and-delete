import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../TodoTask/TodoTask';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removedTodosId: number[];
  onDeleteTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removedTodosId,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoTask
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            isLoading={removedTodosId.includes(todo.id)}
          />
        );
      })}

      {!!tempTodo && (
        <TodoTask
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoading={true}
        />
      )}
    </section>
  );
};
