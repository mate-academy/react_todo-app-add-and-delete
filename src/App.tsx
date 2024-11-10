/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { SelectedFilter } from './types/SelectedFilter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorSection } from './components/ErrorSection';

const initialErrorMessage: ErrorMessage = {
  load: false,
  create: false,
  delete: false,
  emptyTitle: false,
};

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>(
    SelectedFilter.all,
  );
  const [titleNewTodo, setTitleNewTodo] = useState<string>('');
  const [receiving, setReceiving] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<string>('');
  const [deletingCompletedTodos, setDeletingCompletedTodos] = useState<
    Todo[] | null
  >(null);

  const visibleTodos = todos.filter(todo => {
    switch (selectedFilter) {
      case SelectedFilter.all:
        return true;
      case SelectedFilter.active:
        return !todo.completed;
      case SelectedFilter.completed:
        return todo.completed;
    }
  });

  const itemLeft: number = todos.filter(todo => !todo.completed).length;
  const completedTodos: Todo[] = todos.filter(todo => todo.completed);

  function getAllTodos() {
    getTodos()
      .then(resultTodos => {
        setTodos(resultTodos);
      })
      .catch(() => {
        setErrorMessage({ ...errorMessage, load: true });
        setInterval(() => {
          setErrorMessage({ ...errorMessage, load: false });
        }, 3000);
      });
  }

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    if (!title) {
      setErrorMessage({ ...errorMessage, emptyTitle: true });
      setInterval(() => {
        setErrorMessage({ ...errorMessage, emptyTitle: false });
      }, 3000);

      return;
    }

    setReceiving(true);

    setTempTodo(title);

    createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleNewTodo('');
      })
      .catch(() => {
        setErrorMessage({ ...errorMessage, create: true });
        setInterval(() => {
          setErrorMessage({ ...errorMessage, create: false });
        }, 3000);
      })
      .finally(() => {
        setReceiving(false);
        setTempTodo('');
      });
  }

  function removeTodo(todoId: number) {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage({ ...errorMessage, delete: true });
        setInterval(() => {
          setErrorMessage({ ...errorMessage, delete: false });
        }, 3000);
      })
      .finally(() => {
        // setDeletingCompletedTodos(null);
      });
  }

  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          visibleTodos={visibleTodos}
          title={titleNewTodo}
          setTitle={setTitleNewTodo}
          addTodo={addTodo}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          receiving={receiving}
        />

        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            removeTodo={removeTodo}
            tempTodo={tempTodo}
            deletingCompletedTodos={deletingCompletedTodos}
            setDeletingCompletedTodos={setDeletingCompletedTodos}
          />
        )}

        {todos.length > 0 && (
          <Footer
            itemLeft={itemLeft}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            completedTodos={completedTodos}
            removeTodo={removeTodo}
            setDeletingCompletedTodos={setDeletingCompletedTodos}
          />
        )}
      </div>

      <ErrorSection errorMessage={errorMessage} />
    </div>
  );
};
