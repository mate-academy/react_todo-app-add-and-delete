import React, { useCallback, useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterOptions } from './types/FilterOptions';
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
      .then(setTodoList)
      .catch(() => setErrorMessage(ErrorMessage.Get))
      .finally(() => setIsloading(false));
  }, []);

  const handleDeleteTodo = (id: number) => {
    setTodoList(prevTodo => prevTodo.filter(todo => todo.id !== id));
  };

  const handleDeleteCompletedTodos = () => {
    setTodoList(todoList.filter(todo => !todo.completed));
  };

  function handleDeleteTodoFromServ(postId: number) {
    deleteTodo(postId)
      .then(() => {
        handleDeleteTodo(postId);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      });
  }

  const handleHideError = () => {
    setErrorMessage('');
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleAddNewTodoToServ = (newTodo: Todo) => {
    postTodo(newTodo.title)
      .then(addedTodo => {
        setTodoList(prevTodos => [...prevTodos, addedTodo]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      });
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

  const handleFilterTodo = useCallback(
    (option: FilterOptions) => {
      switch (option) {
        case FilterOptions.All:
          setFilteredTodos(todoList);
          break;
        case FilterOptions.Active:
          setFilteredTodos(todoList.filter(todo => !todo.completed));
          break;
        case FilterOptions.Completed:
          setFilteredTodos(todoList.filter(todo => todo.completed));
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
          todos={filteredTodos}
          onError={handleError}
          onAddTodo={handleAddNewTodoToServ}
          onCompleted={markAllTodoCompleted}
        />
        {!isLoading && (
          <TodoList
            todos={filteredTodos}
            isLoading={isLoading}
            onToggle={handleChangeToggle}
            onDelete={handleDeleteTodo}
            onDeleteFromServ={handleDeleteTodoFromServ}
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
