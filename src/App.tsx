/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { FilterBy } from './types/FilterBy';
import { Notification } from './components/Notification';

const USER_ID = 6259;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const getAllTodos = async () => {
    try {
      setDisableInput(true);
      const data = await getTodos(USER_ID);

      setTodos(data);
      setDisableInput(false);
    } catch (error) {
      setErrorText('Error with loading todos');
      setIsError(true);
      throw new Error('Error with loading todos');
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  const handleAddTodo = async (todoText: string) => {
    if (todoTitle.length === 0) {
      setIsError(true);
      setErrorText('Title can\'t be empty');

      return;
    }

    const newTodoBody = {
      id: 0,
      title: todoText,
      userId: USER_ID,
      completed: false,
    };

    try {
      setDisableInput(true);
      setTodoTitle('');
      await addTodo(USER_ID, newTodoBody);
      getAllTodos();
    } catch {
      setIsError(true);
      setErrorText('Unable to add a todo');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setDisableInput(true);
      await deleteTodo(USER_ID, todoId);
      getAllTodos();
    } catch {
      setIsError(true);
      setErrorText('Unable to delete a todo');
    }
  };

  const hasComplitedTodos = todos.some(todo => todo.completed === true);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todoTitleChange = (value: string) => {
    setTodoTitle(value);
  };

  const closeError = () => {
    setIsError(false);
  };

  const changeFilter = (selectedFilter: FilterBy) => {
    setFilterBy(selectedFilter);
  };

  const hasActiveTodos = todos.some(todo => todo.completed === false);

  let filteredTodos = todos;

  switch (filterBy) {
    case FilterBy.Active:
      filteredTodos = todos.filter(todo => todo.completed === false);
      break;
    case FilterBy.Complited:
      filteredTodos = todos.filter(todo => todo.completed === true);
      break;
    case FilterBy.All:
    default:
      filteredTodos = todos;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          hasActiveTodos={hasActiveTodos}
          todoTitle={todoTitle}
          todoTitleChange={todoTitleChange}
          handleAddTodo={handleAddTodo}
          disableInput={disableInput}
        />

        <TodoList todos={filteredTodos} handleDeleteTodo={handleDeleteTodo} />

        {todos.length !== 0
        && (
          <Footer
            changeFilter={changeFilter}
            itemsCounter={filteredTodos.length}
            hasComplitedTodos={hasComplitedTodos}
          />
        )}

      </div>

      <Notification
        isError={isError}
        errorText={errorText}
        closeError={closeError}
      />

    </div>
  );
};
