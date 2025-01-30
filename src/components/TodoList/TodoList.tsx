import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleDeleteTodo: (id: number) => void;
  loadingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  handleDeleteTodo,
  loadingTodoId,
}) => {
  const handleToggleTodoCompleted = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleTodoCompleted={handleToggleTodoCompleted}
          loadingTodoId={loadingTodoId}
        />
      ))}
    </section>
  );
};
