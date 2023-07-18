import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  activeTodo: Todo | null;
  setActiveTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  activeTodo,
  setActiveTodo,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        isLoading={activeTodo ? activeTodo.id === todo.id : false}
        setActiveTodo={setActiveTodo}
      />
    ))}
  </section>
);
