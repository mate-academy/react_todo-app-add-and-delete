import React from 'react';
import { Todo } from '../../types/Todo';
import { Task } from '../Task/Task';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null
  deleteTodo: (id: string) => Promise<void>

};

const TodoMain: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((task) => (
        <Task deleteTodo={deleteTodo} key={task.id} todo={task} />
      ))}

      {tempTodo && <Task todo={tempTodo} loading />}
    </section>
  );
});

export { TodoMain };
