import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
}

export const TodoList: React.FC<Props> = ({ todos, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} loaderActive={false} />
      ))}
      {tempTodo && (<TodoItem todo={tempTodo} loaderActive />)}
    </section>
  );
};
