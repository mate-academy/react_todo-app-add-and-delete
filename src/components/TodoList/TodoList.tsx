import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../utils/TodoContext';
import { ErrorType } from '../../types/ErrorType';

type TodoListProps = {
  todos: Todo[];
  onErrorChange: (error: ErrorType | null) => void;
};

export const TodoList: React.FC<TodoListProps> = ({ todos, onErrorChange }) => {
  const { tempTodo } = useTodos(); // Retrieve tempTodo from the context

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onErrorChange={onErrorChange} />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isTemp
          onErrorChange={onErrorChange}
        />
      )}
    </section>
  );
};
