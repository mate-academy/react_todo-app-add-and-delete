/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';

function filterTodos(todos: Todo[], option: FilterOptions) {
  // eslint-disable-next-line no-console
  console.log('called');
  if (option === -1) {
    return todos;
  }

  return todos.filter(todo => todo.completed === option);
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState<FilterOptions>(-1);
  // const handleCreatingNewTodo = ({
  //   userId,
  //   title,
  //   completed,
  // }: Omit<Todo, 'id'>) => {
  //   createNewTodo({ userId, title, completed });
  // };

  const handleFiltrationOption = (option: FilterOptions) => {
    setSelectedOption(option);
  };

  const filteredTodos = filterTodos(todos, selectedOption);

  const handleRemoveTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const handleToggleTodoStatus = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoMain
          todos={filteredTodos}
          removeTodo={handleRemoveTodo}
          toggleStatus={handleToggleTodoStatus}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            selectedOption={selectedOption}
            selectOption={handleFiltrationOption}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={setErrorMessage}
      />
    </div>
  );
};
