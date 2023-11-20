import React, { useEffect, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { Error } from './types/Error';

const USER_ID = 11909;

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.LoadTodos));
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const addTodo = (title: string) => {
    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setErrorMessage('');
    setIsDisable(true);
    setTempTodo({ id: 0, ...newTodo });

    todoService.createTodo(newTodo)
      .then(newPost => {
        setTodos(currentPosts => [...currentPosts, newPost]);
        setTitle('');
      })
      .catch((error) => {
        setErrorMessage(Error.Add);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisable(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    todoService.deleteTodo(todoId)
      .then(() => {

      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage(Error.Delete);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const filterTodos = (query: string) => {
    switch (query) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.All:
      default:
        return todos;
    }
  };

  const visibleTodos = filterTodos(filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          addTodo={addTodo}
          isDisable={isDisable}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filter={filter}
            setFilter={setFilter}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
