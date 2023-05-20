/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import { ErrorMessage } from './types/ErrorMessage';
import { UserWarning } from './UserWarning';
import {getTodos} from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { ToDoList } from './components/ToDoList/ToDoList';
import { TodoStatus } from './types/TodoStatus';
import { ErrorNotification } from './components/ErrorMessage/ErrorNotification';

const USER_ID = 7035;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [ todoStatus, setTodoStatus ] = useState(TodoStatus.ALL);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.NONE);

  const visibleTodos = useMemo(() => {
    return (todos.filter((todo) => {
      switch (todoStatus) {
        case TodoStatus.ACTIVE:
          return !todo.completed;
        case TodoStatus.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    })
    );
  }, [todoStatus, todos]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        console.log('122112');
      }
    };

    fetchData();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          {/* Add a todo on form submit */}
          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main">
          <ToDoList todos={visibleTodos}/>
        </section>
        {todos && (
          <Footer
          todos={todos}
          setTodoStatus={setTodoStatus}
        />
        )}
      </div>
      <ErrorNotification
          errorMessage={errorMessage}
          closeError={() => setErrorMessage(ErrorMessage.NONE)}
        />
    </div>
  );
};
