import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoBody } from '../TodoBody/TodoBody';
import { Errors } from '../../utils/Errors';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (id: number[]) => Promise<PromiseSettledResult<void>[]>;
  onErrorMessageChange: (error: Errors) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onErrorMessageChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoBody
          onErrorMessageChange={onErrorMessageChange}
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}

      {!!tempTodo && (
        <TodoBody
          onErrorMessageChange={onErrorMessageChange}
          onDeleteTodo={onDeleteTodo}
          todo={tempTodo}
        />
      )}
    </section>
  );
};
