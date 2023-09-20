import React from 'react';
import { TodoListItem } from '../TodoListItem/TodoListItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
}

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoListItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
