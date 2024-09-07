import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
};

const TodoList: React.FC<Props> = ({ todos, deleteTodo }) => {
  const showTodos = todos.map(todo => (
    <TodoItem todo={todo} key={todo.id} deleteTodo={deleteTodo} />
  ));

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {showTodos}
    </section>
  );
};

export default TodoList;
