import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  loader: boolean;
  focusedTodoId: number;
  onDeleteTodo: (value: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loader,
  focusedTodoId,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loader={loader}
          focusedTodoId={focusedTodoId}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </section>
  );
};
