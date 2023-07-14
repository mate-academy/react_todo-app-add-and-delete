import { FC, useContext } from 'react';
import { TodoForm } from './TodoContent/TodoForm';
import { TodoList } from './TodoContent/TodoList';
import { TodoFilter } from './TodoContent/TodoFilter';
import { TodoContext } from './TodoContext';
import { ErrorNotification } from './ErrorNotification';

export const TodoApp: FC = () => {
  const {
    todosCount,
    tempTodo,
  } = useContext(TodoContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm />
        <TodoList />

        {(todosCount > 0 || tempTodo) && (
          <TodoFilter />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
