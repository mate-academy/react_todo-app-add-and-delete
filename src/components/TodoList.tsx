import React from 'react';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  setTodos: (array: Todo[]) => void;
  removeTodo: (todo: Todo) => void;
  markCompleted: (todo: Todo) => void;
  changeTitle: (todo: Todo, title: string) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  markCompleted,
  changeTitle,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          markCompleted={markCompleted}
          removeTodo={removeTodo}
          changeTitle={changeTitle}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
