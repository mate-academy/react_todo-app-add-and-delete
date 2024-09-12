import React from 'react';
import { Todo } from '../../types/Todo';
import { Item } from '../Item';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => void;
};

export const Main: React.FC<Props> = ({ todos, tempTodo, onTodoDelete }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <Item key={todo.id} todo={todo} onTodoDelete={onTodoDelete} />
    ))}
    {tempTodo && (
      <Item
        todo={tempTodo}
        startingStatus={TodoStatus.Loading}
        onTodoDelete={onTodoDelete}
      />
    )}
  </section>
);
