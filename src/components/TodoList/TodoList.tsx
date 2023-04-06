import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => (
  <>
    {todos.map((todo: Todo) => (
      <TodoItem todo={todo} key={todo.id} />
    ))}
  </>
);
