/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodosList';
import * as todosApi from './api/todos';
import { Header } from './components/TodoHeader';
import { Hidden } from './components/TodoHidden';
import { TodoFooter } from './components/TodoFooter';
import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodosFilter>(TodosFilter.all);
  const [newTodo, setNewTodo] = useState<string>('');
  const [errorNotification, setErrorNotification] = useState<string>('');
  const [updatingTodo, setUpdatingTodo] = useState<boolean>(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await todosApi.getTodos();

        setCurrentTodos(todos);
        setErrorNotification('');
      } catch (error) {
        setErrorNotification('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          setCurrentTodos={setCurrentTodos}
          setUpdatingTodo={setUpdatingTodo}
          setErrorNotification={setErrorNotification}
          updatingTodo={updatingTodo}
        />
        {currentTodos.length > 0 && (
          <TodoList
            currentTodos={currentTodos}
            filter={filter}
            setCurrentTodos={setCurrentTodos}
            updatingTodo={updatingTodo}
            newTodo={newTodo}
            setErrorNotification={setErrorNotification}
          />
        )}
        {/* Hide the footer if there are no todos */}
        {currentTodos.length > 0 && (
          <TodoFooter
            currentTodos={currentTodos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Hidden errorNotification={errorNotification} />
    </div>
  );
};
