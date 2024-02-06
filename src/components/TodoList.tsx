import React from 'react';
// import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, deleteTodo }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodo={deleteTodo}
      // loading={false}
      />
    ))}
  </section>
);
