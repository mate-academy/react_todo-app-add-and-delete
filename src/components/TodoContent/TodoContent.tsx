import { useState } from 'react';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoFooter } from '../TodoFooter';
import { TodoHeader } from '../TodoHeader';
import { TodoMain } from '../TodoMain';

type Props = {
  filterTodos: (filterBy: Filter) => void;
  todos: Todo[] | null;
};

export const TodoContent: React.FC<Props> = ({ todos, filterTodos }) => {
  const [filter, setFilter] = useState<Filter>(Filter.all);

  return (
    <div className="todoapp__content">
      <TodoHeader />
      <TodoMain todos={todos} />
      {todos && (
        <TodoFooter
          todosLength={todos?.length}
          filter={filter}
          onChange={(selectedFilter) => {
            setFilter(selectedFilter);
            filterTodos(selectedFilter);
          }}
        />
      )}
    </div>
  );
};
