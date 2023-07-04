import { FC, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoContentHeader } from './TodoContentHeader';
import { TodoContentFooter } from './TodoContentFooter';
import { TodoContentMain } from './TodoContentMain';
import { TodoStatus } from '../types/TodoStatus';
import { getFilteredTodos } from '../helpers/getFilteredTodos';

interface TodoContentProps {
  todos: Todo[],
}

export const TodoContent: FC<TodoContentProps> = ({ todos }) => {
  const [
    selectedStatusTodo, setSelectedStatusTodo,
  ] = useState<TodoStatus>(TodoStatus.All);

  const visibleTodos = getFilteredTodos(todos, selectedStatusTodo);

  return (
    <div className="todoapp__content">
      <TodoContentHeader />

      <TodoContentMain todos={visibleTodos} />

      {todos.length > 0 && (
        <TodoContentFooter
          selectedStatusTodo={selectedStatusTodo}
          onSelectStatusTodo={setSelectedStatusTodo}
        />
      )}
    </div>
  );
};
