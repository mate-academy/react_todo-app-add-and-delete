import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { Notification } from './components/Notification/Notification';
import { Todolist } from './components/Todolist/Todolist';
import { getTodos } from './api/todos';

const USER_ID = 10897;
// const USER_ID = 10928;
// It`s not real USER_ID, because in case https://mate-academy.github.io/react_todo-app-with-api/ doesn't respond.

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<TodoStatus>(TodoStatus.ALL);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((loadedTodos: Todo[]) => {
        setTodos(loadedTodos);
      })
      .catch((loadedError: Error) => {
        setIsError(loadedError?.message ?? 'Error');
      });
  }, []);

  const getFilteredTodos = (visibleTodos: Todo[], filter: TodoStatus) => {
    return visibleTodos.filter(todo => {
      switch (filter) {
        case TodoStatus.ACTIVE:
          return todo.completed ? 0 : todo;
        case TodoStatus.COMPLETED:
          return todo.completed ? todo : 0;
        case TodoStatus.ALL:
          return todo;
        default:
          return 0;
      }
    });
  };

  const filteredTodos = getFilteredTodos(todos, filterBy);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <Todolist filteredTodos={filteredTodos} />

            <Footer
              todos={todos}
              todoStatus={filterBy}
              setTodoStatus={setFilterBy}
            />
          </>
        )}
      </div>

      {isError && <Notification />}
    </div>
  );
};
