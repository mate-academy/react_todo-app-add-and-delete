import React, { useState, useEffect } from 'react';
import { TodoappHeader } from './components/TodoappHeader';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoappErrorsBlock } from './components/TodoappErrorsBlock';
import { TodoappFooter } from './components/TodoappFooter';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const visibleTodos = [...todos].filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoappHeader inputValue={inputValue} onInputChange={setInputValue} />
        {todos.length > 0 && (
          <>
            <TodoList todos={visibleTodos} />
            <TodoappFooter
              todos={todos}
              selectedFilter={filter}
              onFilterChange={setFilter}
            />
          </>
        )}
      </div>
      <TodoappErrorsBlock
        errorMessage={errorMessage}
        onDelete={setErrorMessage}
      />
    </div>
  );
};
