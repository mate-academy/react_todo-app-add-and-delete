import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({ todos, setTodos }) => {
  function removeTodo(todoId) {
    deleteTodo(todoId);
    setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          onDelete={async () => removeTodo(todo.id)}
          key={todo.id}
          todo={todo}
        />
      ))}
    </section>
  );
};
