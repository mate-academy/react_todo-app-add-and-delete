import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  todosBoot: number[];
  deleteTodo: (todoId: number) => void;
};

const TodoList: React.FC<Props> = ({ todos, todosBoot, deleteTodo }) => {
  const showTodos = todos.map(todo => (
    <TodoItem
      todo={todo}
      key={todo.id}
      todosBoot={todosBoot}
      deleteTodo={deleteTodo}
    />
  ));

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {showTodos}
    </section>
  );
};

export default TodoList;
