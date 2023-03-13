import { FC, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Footer, FilteringMethod } from '../Footer';
import { TodoTask } from '../TodoTask';

type Props = {
  todos: Todo[];
  tempTodo?: Todo;
  onDelete: (id: number) => void;
  onClearAll: () => void;
  loadingTodosIDs: number[];
};

const getVisibleTodos = (todos: Todo[], status: FilteringMethod): Todo[] => {
  if (status === 'Active') {
    return todos.filter(todo => !todo.completed);
  }

  if (status === 'Completed') {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onClearAll,
  loadingTodosIDs,
}) => {
  const [filterStatus, changeFilterStatus] = useState<FilteringMethod>('All');

  const visibleTodos = getVisibleTodos(todos, filterStatus);
  const remainTodos = todos.filter(todo => !todo.completed).length;
  const completedCount = getVisibleTodos(todos, 'Completed').length;

  return (
    <>
      <section className="todoapp__main">
        {visibleTodos.map(todo => {
          const isLoading = loadingTodosIDs.some(id => id === todo.id);

          return (
            <TodoTask
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              isLoading={isLoading}
            />
          );
        })}
      </section>

      {tempTodo && (
        <TodoTask
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={() => {}}
          isLoading
        />
      )}

      <Footer
        status={filterStatus}
        onStatusChange={changeFilterStatus}
        remainTodos={remainTodos}
        completedTodos={completedCount}
        onClearAll={onClearAll}
      />
    </>
  );
};
