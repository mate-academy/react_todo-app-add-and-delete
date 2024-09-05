import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
};

const TodoList: React.FC<Props> = ({ todos, onDelete }) => {
  const showTodos = todos.map(todo => (
    <TodoItem todo={todo} key={todo.id} onDelete={onDelete} />
  ));

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {showTodos}
    </section>
  );
};

export default TodoList;
