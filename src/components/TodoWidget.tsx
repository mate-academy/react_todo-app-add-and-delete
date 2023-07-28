import React, { useContext } from 'react';
import TodoListHeader from './TodoListHeader';
import TodoListData from './TodoListData';
import TodoListFilterPanel from './TodoListFilterPanel';
import ErrorNotification from './ErrorNotification';
import { TodoContext } from '../context/todo.context';

const TodoWidget:React.FC = () => {
  const { todosStatistics, error } = useContext(TodoContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoListHeader />

        <TodoListData />

        {
          todosStatistics.totalTodos > 0 && (
            <TodoListFilterPanel />
          )
        }
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {
        error && (
          <ErrorNotification />
        )
      }
    </div>
  );
};

export default TodoWidget;
