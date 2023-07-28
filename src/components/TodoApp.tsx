/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
} from 'react';
import cn from 'classnames';

import { UserWarning } from '../UserWarning';
import { filterTodos } from '../services/todos';
import { Filter } from './Filter';
import { TodoList } from './TodoList';
import { NotificationBlock } from './NotificationBlock';
import { NewTodo } from './NewTodo';
import { TodosContext } from '../context/todosContext';

export const TodoApp: React.FC = () => {
  const {
    todos,
    filterBy,
    USER_ID,
  } = useContext(TodosContext);

  const preparedTodos = React.useMemo(() => {
    return filterTodos(todos, filterBy);
  }, [todos, filterBy]);

  const isAllTodosCompleted = React.useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: isAllTodosCompleted,
              })}
            />
          )}

          <NewTodo />
        </header>
        {todos.length > 0 && (
          <>
            <TodoList todos={preparedTodos} />

            <Filter />
          </>
        )}
      </div>

      <NotificationBlock />
    </div>
  );
};
