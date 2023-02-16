import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todo: Todo) => void;
};

export const TodoList:React.FC<Props> = ({ todos, onDeleteTodo }) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
      />
    ))}
  </section>
);
