import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
};

const TodoList: React.FC<Props> = ({ todos }) => {
  const showTodos = todos.map(todo => <TodoItem todo={todo} key={todo.id} />);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {showTodos}
    </section>
  );
};

export default TodoList;
