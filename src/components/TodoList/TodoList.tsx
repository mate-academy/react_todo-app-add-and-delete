import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, removeTodo = () => {} }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem todo={todo} removeTodo={removeTodo} key={todo.id} />
      ))}
    </section>
  );
};
