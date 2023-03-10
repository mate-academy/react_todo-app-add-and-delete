/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';

import { Todo, TodoRequest } from './types/Todo';
import { FilteredBy } from './types/FilteredBy';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Footer } from './Footer.tsx';
import { TodoList } from './TodoList';
// eslint-disable-next-line import/no-cycle
import { Header } from './Header';
import { Notifications } from './Notification';

const USER_ID = 6459;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [todoStatus, setTodoStatus] = useState<FilteredBy>(FilteredBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todosToShow = useMemo(() => {
    return todos.filter(todo => {
      switch (todoStatus) {
        case FilteredBy.ALL:
          return true;

        case FilteredBy.ACTIVE:
          return !todo.completed;

        case FilteredBy.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, todoStatus]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to upload a todo');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = async () => {
    if (query.length > 0) {
      const newTodo: TodoRequest = {
        userId: USER_ID,
        title: query,
        completed: false,
      };

      setQuery('');
      setTempTodo({ id: 0, ...newTodo });
      await addTodo(newTodo)
        .then(newTodoFromServer => {
          setTodos(prevTodos => [...prevTodos, newTodoFromServer]);
          setTempTodo(null);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
        });
    } else {
      setErrorMessage("Title can't be empty");
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const handleDeleteCompletedTodos = () => {
    const completedTodos = todosToShow.filter(todo => todo.completed);

    completedTodos.forEach(async completedTodo => {
      await deleteTodo(completedTodo.id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(
            prevTodo => prevTodo.id !== completedTodo.id,
          ));
        })
        .catch(() => {
          setErrorMessage('Unable to clear completed todos');
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={handleAddTodo}
          tempTodo={tempTodo}
          query={query}
          setQuery={setQuery}
          todos={todos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todosToShow={todosToShow}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
            />
            <Footer
              onDeleteCompleted={handleDeleteCompletedTodos}
              todosToShow={todosToShow}
              todoStatus={todoStatus}
              setTodoStatus={setTodoStatus}
            />
          </>
        )}
        <Notifications
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};
