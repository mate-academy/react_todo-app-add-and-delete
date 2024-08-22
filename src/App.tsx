/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import Footer from './components/Footer/Footer';
import { FilterParams } from './types/Filters';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const [filterParams, setFilterParams] = useState<FilterParams>(
    FilterParams.All,
  );

  const [todosToBeDeleted, setTodosToBeDeleted] = useState<number[]>([]);

  const handleAddTodoToState = (todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  };

  const onDeleteTodo = async (id: number) => {
    setTodosToBeDeleted(prevTodo => [...prevTodo, id]);
    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setTodos(todos);
      setErrorMessage(Errors.CantDelete);
      throw error;
    } finally {
      setTodosToBeDeleted([]);
    }
  };

  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setErrorMessage(Errors.CantLoad));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getVisibleTodos = () => {
    return todos.filter(todo => {
      switch (filterParams) {
        case FilterParams.Active:
          return !todo.completed;
        case FilterParams.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  };
  const visibleTodos: Todo[] = getVisibleTodos();

  const onClearCompleted = async () => {
    const completedTodos = visibleTodos.filter(todo => todo.completed);
    const isDeletingTodo = completedTodos.map(todo => todo.id);

    try {
      await Promise.all(isDeletingTodo.map(id => onDeleteTodo(id)));
    } catch (error) {
      setErrorMessage(Errors.CantDelete);
    } finally {
      setTodosToBeDeleted([]);
    }
  };

  const itemsLeft = todos.filter(item => item.completed === false).length;
  const isClearButtonDisabled = !visibleTodos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          handleAddTodoToState={handleAddTodoToState}
          todosToBeDeleted={todosToBeDeleted}
        />

        <TodoList
          todos={visibleTodos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          tempTodo={tempTodo}
          todosToBeDeleted={todosToBeDeleted}
          onDeleteTodo={onDeleteTodo}
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            setFilterParams={setFilterParams}
            filterParams={filterParams}
            itemsLeft={itemsLeft}
            onClearCompleted={onClearCompleted}
            isClearButtonDisabled={isClearButtonDisabled}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage error={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};