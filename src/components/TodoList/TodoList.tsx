import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodoHandler: (id: number) => void;
  tempTodo: Todo | null;
  deletedTodoId: Todo | undefined;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodoHandler,
  tempTodo,
  deletedTodoId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodoHandler={deleteTodoHandler}
        tempTodo={tempTodo}
        deletedTodoId={deletedTodoId}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        deleteTodoHandler={deleteTodoHandler}
        tempTodo={tempTodo}
        deletedTodoId={deletedTodoId}
      />
    )}
  </section>
);
