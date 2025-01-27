import React, { useCallback, useEffect, useState } from 'react';
import { getTodos, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export enum ErrorMessage {
  Update = 'Unable to update a todo',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Get = 'Unable to load todos',
  Title = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const [isLoading, setIsloading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsloading(true);
    getTodos()
      .then(todos => {
        setTodoList(todos);
      })
      .catch(() => setErrorMessage(ErrorMessage.Get))
      .finally(() => setIsloading(false));
  }, []);

  const handleHideError = () => {
    setErrorMessage('');
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleAddNewTodo = (newTodo: Todo) => {
    setTodoList(prevTodos => [...prevTodos, newTodo]);
  };

  const markAllTodoCompleted = () => {
    const isCompleted = todoList.every(todo => todo.completed);

    const updatedTodo = todoList.map(todo => ({
      ...todo,
      completed: !isCompleted,
    }));

    setTodoList(updatedTodo);
  };

  const handleChangeToggle = (id: number) => {
    setTodoList(prevTodo =>
      prevTodo.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodoList(prevTodo => prevTodo.filter(todo => todo.id !== id));
  };

  const handleDeleteCompletedTodos = () => {
    setTodoList(todoList.filter(todo => !todo.completed));
  };

  const handleFilterTodo = useCallback(
    (option: string) => {
      switch (option) {
        case 'All':
          setFilteredTodos(todoList);
          break;
        case 'Active':
          setFilteredTodos(todoList.filter(todo => todo.completed === false));
          break;
        case 'Completed':
          setFilteredTodos(todoList.filter(todo => todo.completed === true));
          break;
        default:
          setFilteredTodos(todoList);
      }
    },
    [todoList],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todo-app">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todoList}
          onError={handleError}
          onAddTodo={handleAddNewTodo}
          onCompleted={markAllTodoCompleted}
        />
        {!isLoading && (
          <TodoList
            todos={filteredTodos}
            isLoading={isLoading}
            onToggle={handleChangeToggle}
            onDelete={handleDeleteTodo}
            onError={handleError}
          />
        )}
        {todoList.length !== 0 && (
          <TodoFooter
            todos={todoList}
            onFilter={handleFilterTodo}
            onDeleteCompletedTodo={handleDeleteCompletedTodos}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} onClose={handleHideError} />
    </div>
  );
};
