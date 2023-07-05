/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Filters } from './types/Filter';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';

const USER_ID = 10908;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState(Filters.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const removeError = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer: Todo[]) => {
        setTodos(todosFromServer);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setTimeout(removeError, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const filteredTodos = () => {
    switch (filter) {
      case Filters.Active:
        return uncompletedTodos;

      case Filters.Completed:
        return completedTodos;
      default:
        return todos;
    }
  };

  const createTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const createdTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTodo(todoTitle);
    setTodoTitle('');
  };

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => (
    setTodoTitle(event.target.value)
  );

  const handleClearCompleted = () => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleSubmit={handleSubmit}
          handleTodoTitle={handleTodoTitle}
          uncompletedTodos={uncompletedTodos}
          tempTodo={tempTodo}
          todoTitle={todoTitle}
        />

        <TodoList
          todos={filteredTodos()}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
        />

        {todos.length !== 0
        && (
          <TodoFooter
            completedTodos={completedTodos}
            uncompletedTodos={uncompletedTodos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
