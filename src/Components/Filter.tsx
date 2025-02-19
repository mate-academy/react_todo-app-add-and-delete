import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type Props = {
  filter: 'All' | 'Active' | 'Completed';
  todos: Todo[];
  loading: boolean;
  selectedTodoId: number | null;
  handleDelete: (todoId: number) => void;
  setSelectedTodoId: (todoId: number) => void;
  requestMethod: 'GET' | 'POST' | 'UPDATE' | 'DELETE' | null;
};

const Filter: React.FC<Props> = ({
  filter = 'All',
  todos,
  loading,
  selectedTodoId,
  handleDelete,
  setSelectedTodoId,
  requestMethod,
}) => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);

  useEffect(() => {
    const handleFilterTodos = () => {
      switch (filter) {
        case 'Active':
          setVisibleTodos(todos.filter(todo => !todo.completed));
          break;
        case 'Completed':
          setVisibleTodos(todos.filter(todo => todo.completed));
          break;
        default:
          setVisibleTodos(todos);
      }
    };

    handleFilterTodos();
  }, [filter, todos]);

  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loading}
          selectedTodoId={selectedTodoId}
          handleDelete={handleDelete}
          setSelectedTodoId={setSelectedTodoId}
          requestMethod={requestMethod}
        />
      ))}
    </>
  );
};

export default Filter;
