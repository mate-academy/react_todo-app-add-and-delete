import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { deleteTodo, getTodos, createTodo } from './api/todos';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 35;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);

  const closeErrorMsg = () => {
    setErrorMessage(ErrorMessage.NONE);
  };

  const newError = (errorMes: ErrorMessage) => {
    setErrorMessage(errorMes);
    setTimeout(() => {
      closeErrorMsg();
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        newError(ErrorMessage.CANNOT_LOAD_TODOS);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case FilterType.ACTIVE:
        return !todo.completed;
      case FilterType.COMPLETED:
        return todo.completed;
      case FilterType.ALL:
      default:
        return true;
    }
  });

  const addTodo = (title: string) => {
    createTodo({ title, userId: USER_ID, completed: false })
      .then((newTodo) => {
        const typedNewTodo = newTodo as Todo;

        setTodos((currentTodos: Todo[]) => [...currentTodos, typedNewTodo]);
      });
  };

  const deleteTodos = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        newError(ErrorMessage.UNABLE_TO_DELETE_A_TODO);
      });
  };

  const removeCompletedTodos = () => {
    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => deleteTodos(todo.id)),
    )
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => !todo.completed)));
  };

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header CreateTodo={addTodo} neError={newError} />
        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodos}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            itemsLeft={itemsLeft}
            removeCompleted={removeCompletedTodos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification errorMessage={errorMessage} close={closeErrorMsg} />
    </div>
  );
};
