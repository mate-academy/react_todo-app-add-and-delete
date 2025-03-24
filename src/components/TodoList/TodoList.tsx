import React, { useState } from 'react';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

import { TodoItem } from '../Todo/TodoItem';
import { Footer } from '../Footer/Footer';

type Props = {
  todoList: Todo[];
  tempTodo?: Todo | null;
  removeTodo: (id: number) => void;
  showErrorMessage: (message: string, delay?: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  tempTodo = null,
  removeTodo,
  showErrorMessage,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.all);

  const filteredList = (list: Todo[]) => {
    switch (activeFilter) {
      case FilterType.all: {
        return list;
      }

      case FilterType.active: {
        return list.filter(item => item.completed === false);
      }

      case FilterType.completed: {
        return list.filter(item => item.completed === true);
      }
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredList(todoList).map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          showErrorMessage={showErrorMessage}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem todo={tempTodo} isLoadingDefault={true} />
      )}

      {todoList?.length !== 0 && (
        <Footer
          todoList={todoList}
          removeTodo={removeTodo}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          showErrorMessage={showErrorMessage}
        />
      )}
    </section>
  );
};
