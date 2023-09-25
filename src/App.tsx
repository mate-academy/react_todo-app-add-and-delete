/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import {
  deleteTodo, getTodos, postTodos, updateTodo,
} from './api/todos';
import { CurrentError } from './types/CurrentError';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoFilter } from './types/TodoFilter';
import { filterTodos } from './utils/filter';

const USER_ID = 11535;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoFilter, setTodoFilter] = useState<TodoFilter>(TodoFilter.All);
  const [errorMessage, setErrorMessage] = useState(CurrentError.Default);
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(CurrentError.LoadingError);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(CurrentError.Default);
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    const prepTodos = filterTodos(todos, todoFilter);

    setFilteredTodos(prepTodos);
  }, [todos, todoFilter]);

  const handleSetTodoFilter = (filter: TodoFilter) => (

    setTodoFilter(filter)
  );

  const handleAddNewTodo = async (todoTitle: string) => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    try {
      const responseTodo = await postTodos(newTodo);
      const updatedTodos = [...todos, responseTodo];

      setTempTodo(null);
      setTodos(updatedTodos);

      return true;
    } catch (error) {
      setTempTodo(null);
      setErrorMessage(CurrentError.AddError);

      return false;
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos((prevState) => prevState.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(CurrentError.DeleteError);
    }
  };

  const handleChangeStatus = async (todoId: number) => {
    const todoToUpdate = todos.find((todo) => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const newStatus = {
      completed: !todoToUpdate.completed,
    };

    try {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      });

      setTodos(updatedTodos);

      await updateTodo(todoId, newStatus);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', error);
      throw error;
    }
  };

  // const handleDeleteAllCompleted = async () => {

  // }

  const hideErros = () => {
    setErrorMessage(CurrentError.Default);
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onSetErrorMessage={setErrorMessage}
          onAddNewTodo={handleAddNewTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isClearCompleted={isClearCompleted}
          onChangeStatus={handleChangeStatus}
          onDeleteTodo={handleDeleteTodo}
          onSetErrorMessage={setErrorMessage}
          setIsClearCompleted={setIsClearCompleted}
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            filter={todoFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            setFilter={handleSetTodoFilter}
            setIsClearCompleted={setIsClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorMessage={errorMessage} hideErros={hideErros} />
    </div>
  );
};
