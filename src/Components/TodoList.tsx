import React from 'react';
import { Todo } from '../types/Todo';
import Filter from './Filter';

type Props = {
  todos: Todo[];
  setSelectedTodoId: (todoId: number) => void;
  handleDelete: (id: number) => void;
  loading: boolean;
  requestMethod: 'GET' | 'POST' | 'UPDATE' | 'DELETE' | null;
  selectedTodoId: number | null;
  filter: 'Active' | 'Completed' | 'All';
};

const TodoList: React.FC<Props> = ({
  todos,
  filter,
  setSelectedTodoId,
  selectedTodoId,
  handleDelete,
  loading,
  requestMethod,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <Filter
        todos={todos}
        filter={filter}
        setSelectedTodoId={setSelectedTodoId}
        selectedTodoId={selectedTodoId}
        handleDelete={handleDelete}
        loading={loading}
        requestMethod={requestMethod}
      />
    </section>
  );
};

export default TodoList;
