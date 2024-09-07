import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import TempTodo from './TempTodo';

type Props = {
  todos: Todo[];
  todosBoot: number[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
};

const TodoList: React.FC<Props> = ({
  todos,
  todosBoot,
  deleteTodo,
  tempTodo,
}) => {
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
      {tempTodo && <TempTodo title={tempTodo.title} />}
    </section>
  );
};

export default TodoList;
