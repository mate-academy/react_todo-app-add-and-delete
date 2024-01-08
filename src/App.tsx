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

const USER_ID = 12147;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tasksFilter, setTasksFilter] = useState<TasksFilter>(TasksFilter.all);
  const [errorId, setErrorId] = useState(0);
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
        setErrorId(0);
      } catch (error) {
        setErrorId(1);
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
          setErrorId={setErrorId}
        />

        {todos.length > 0 && (
          <>
            <Section
              todos={todos}
              setTodos={setTodos}
              tasksFilter={tasksFilter}
              setErrorId={setErrorId}
            />
            <Footer
              setTasksFilter={setTasksFilter}
              tasksFilter={tasksFilter}
              setTodos={setTodos}
            />
          </>
        )}
      </div>
      {errorId !== 0 && (
        <Errors
          errorId={errorId}
          setErrorId={setErrorId}
        />
      )}
    </div>
  );
};
