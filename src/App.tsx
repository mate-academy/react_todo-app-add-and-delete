import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import * as todoMethods from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [title, setTitle] = useState('');

  const fetchData = () => {
    todoMethods
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  };

  useEffect(() => {
    fetchData();
  }, []);

  function getFilteredTodos(newTodos: Todo[], newFilter: Filter) {
    switch (newFilter) {
      case Filter.Active:
        return newTodos.filter(todo => !todo.completed);
      case Filter.Completed:
        return newTodos.filter(todo => todo.completed);
      default:
        return newTodos;
    }
  }

  const filteredTodos = getFilteredTodos(todos, filter);

  const addTodo = (input: string) => {
    setIsLoading(true);
    setTempTodo({
      userId: todoMethods.USER_ID,
      title: input,
      id: 0,
      completed: false,
    });

    todoMethods
      .createTodo({
        userId: todoMethods.USER_ID,
        title: input,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const deleteAllCompleted = async () => {
    todos.filter(
      todo =>
        todo.completed &&
        todoMethods
          .deleteTodo(todo.id)
          .then(() => setTodos([...todos.filter(item => !item.completed)])),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          isDisabled={isLoading}
          todos={todos}
          setTempTodo={setTempTodo}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={filteredTodos}
          fetchData={fetchData}
          setErrorMessage={setErrorMessage}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            fetchData={fetchData}
            setErrorMessage={setErrorMessage}
            isTempt={true}
          />
        )}

        {!!todos.length && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      <Error error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
