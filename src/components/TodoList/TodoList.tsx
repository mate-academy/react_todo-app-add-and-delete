import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[]
  tempTodo: Todo | null,
};

export const TodoList: React.FC<TodoListProps> = memo(({ todos, tempTodo }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} />}
  </section>
));
