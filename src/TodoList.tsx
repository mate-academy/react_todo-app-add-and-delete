import React from 'react';
import { Todo } from './types/Todo';
import { TodoComp } from './TodoComp';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, tempTodo, onDelete }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoComp
        key={todo.id}
        id={todo.id}
        completed={todo.completed}
        title={todo.title}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && <TodoItem tempTodo={tempTodo} />}
  </section>
);
