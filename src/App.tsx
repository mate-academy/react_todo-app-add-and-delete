/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { Footer } from './components/Footer';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import { TasksFilter } from './types/tasksFilter';
import { Errors } from './components/Errors';
import { ErrorMesage } from './types/ErrorIMessage';

const USER_ID = 12147;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tasksFilter, setTasksFilter] = useState<TasksFilter>(TasksFilter.all);
  const [errorMessage, setErrorMessage] = useState<ErrorMesage>(ErrorMesage.noErrors);
  const [todo, setTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await postService.getTodos(USER_ID);

        setTodos(result);
        setErrorMessage(ErrorMesage.noErrors);
      } catch (error) {
        setErrorMessage(ErrorMesage.loadingError);
      }
    }

    fetchData();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todo={todo}
          setTodo={setTodo}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />

        {todos.length > 0 && (
          <>
            <Section
              todos={todos}
              setTodos={setTodos}
              tasksFilter={tasksFilter}
              setErrorMessage={setErrorMessage}
            />
            <Footer
              setTasksFilter={setTasksFilter}
              tasksFilter={tasksFilter}
              setTodos={setTodos}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <Errors
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
