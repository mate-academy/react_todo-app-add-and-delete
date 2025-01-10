import React, { useEffect, useState } from 'react';

import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { ErrorMessage } from './Components/ErrorMessage/ErrorMessage';
import { Errors } from './types/Errors';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

import { getTodos, deleteTodo } from './api/todos';

import { Header } from './Components/Header/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const areAllTodosCompleted = todos.every(todo => todo.completed);
  const noCompletedTodos = todos.every(todo => !todo.completed);
  const [todosToBeDeleted, setTodosToBeDeleted] = useState<number[]>([]);

  const [filter, setFilter] = useState<Filter>(Filter.All);

  const handleFilter = (filteringCriteria: Filter) => {
    setFilter(filteringCriteria);
  };

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(Errors.NoError), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleErrorMessage(Errors.CantLoad);
      });
  }, []);

  const handleDelete = async (id: number) => {
    setTodosToBeDeleted(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? todo : { ...todo, deleted: false })),
      );
      handleErrorMessage(Errors.CantDelete);
    } finally {
      setTodosToBeDeleted([]);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    try {
      await Promise.all(idsToDelete.map(id => handleDelete(id)));
    } catch (error) {
      handleErrorMessage(Errors.CantDelete);
    } finally {
      setTodosToBeDeleted([]);
    }
  };

  const handleAddTodoToState = (todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosToBeDeleted={todosToBeDeleted}
          areAllTodosCompleted={areAllTodosCompleted}
          handleErrorMessage={handleErrorMessage}
          handleAddTodoToState={handleAddTodoToState}
          setTempTodo={setTempTodo}
        />
        {!!todos.length && (
          <>
            <TodoList
              todoToBeDeleted={todosToBeDeleted}
              tempTodo={tempTodo}
              todos={todos}
              filter={filter}
              handleDelete={handleDelete}
            />
            <Footer
              todos={todos}
              handleFilter={handleFilter}
              filter={filter}
              noCompletedTodos={noCompletedTodos}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorMessage errorMessageText={errorMessage} />
    </div>
  );
};
