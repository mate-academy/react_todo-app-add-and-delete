import { useEffect, useState } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoFooter } from '../TodoFooter';
import { TodoHeader } from '../TodoHeader';
import { TodoMain } from '../TodoMain';

type Props = {
  filterTodos: (filterBy: Filter) => void;
  todos: Todo[] | null;
  onError: (value: ErrorMessages | null) => void;
  createTodo: (title: string) => void;
  tempTodo: Todo | null;
  isInputDisabled: boolean;
  deleteTodo: (id: number) => void;
  clearCompleted: () => void;
};

export const TodoContent: React.FC<Props> = ({
  todos,
  filterTodos,
  onError,
  createTodo,
  tempTodo,
  isInputDisabled,
  deleteTodo,
  clearCompleted,
}) => {
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [hasIncompleteTodos, setHasIncompleteTodos] = useState(false);

  const onSwitchFilter = (f: Filter) => {
    setFilter(f);
    filterTodos(f);
  };

  useEffect(() => {
    if (todos?.some((todo) => todo.completed)) {
      setHasIncompleteTodos(true);
    }
  });

  return (
    <div className="todoapp__content">
      <TodoHeader
        onError={onError}
        createTodo={createTodo}
        isInputDisabled={isInputDisabled}
      />

      <TodoMain todos={todos} tempTodo={tempTodo} deleteTodo={deleteTodo} />

      {todos && (
        <TodoFooter
          todosLength={todos?.length}
          selectFilter={filter}
          switchFilter={(selectedFilter) => onSwitchFilter(selectedFilter)}
          hasIncompleteTodos={hasIncompleteTodos}
          clearCompleted={clearCompleted}
        />
      )}
    </div>
  );
};
