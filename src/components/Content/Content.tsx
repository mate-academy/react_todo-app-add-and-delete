import React, { useMemo, useState, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoHeader } from '../TodoHeader/TodoHeader';
import { TodoFooter } from '../TodoHeader/TodoFooter';
import { TodoMain } from '../TodoMain/TodoMain';
import { Filter } from '../../enums/Filter';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null
  createNewTodo: (title: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  deleteAllTodos:() => Promise<void>
};

const Content: React.FC<Props> = memo(({
  todos,
  createNewTodo,
  deleteTodo,
  deleteAllTodos,
  tempTodo,
}) => {
  const [filter, setFilter] = useState(Filter.All);

  const filteredList = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.All:
      default:
        return todos;
    }
  }, [filter, todos]);

  const allTasksAreCompleted = todos.every(todo => todo.completed);
  const someTaskIsCompleted = todos.some(todo => todo.completed);
  const countOfActiveTodos = todos.reduce((count, todo) => {
    if (!todo.completed) {
      return count + 1;
    }

    return count;
  }, 0);

  return (
    <div className="todoapp__content">
      <TodoHeader
        createNewTodo={createNewTodo}
        activeButton={allTasksAreCompleted}
      />

      {!!todos.length && (
        <>
          <TodoMain
            tempTodo={tempTodo}
            todos={filteredList}
            deleteTodo={deleteTodo}
          />
          <TodoFooter
            showClearButton={someTaskIsCompleted}
            filter={filter}
            itemsCount={countOfActiveTodos}
            deleteAllTodos={deleteAllTodos}
            setFilter={setFilter}
          />
        </>
      )}
    </div>
  );
});

export { Content };
