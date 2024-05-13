import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, getDelete, getAdd } from './api/todos';

import { Todo } from './types/Todo';
import { SortType } from './types/SortType';

import { Todos } from './components/Todos/Todos';
import { Footer } from './components/Footer/Footer';
import { getFilter } from './components/FilterFunc/FilterFunc';
import { Form } from './components/Header-Form/Form';
import { ErrorType } from './types/ErrorType';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [sortField, setSortField] = useState(SortType.All);

  // const [isDeleting, setIsDeleting] = useState(false);

  // const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  const activeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.UnableLoad);

        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });

    if (activeInput.current) {
      activeInput.current.focus();
    }
  }, []);

  const sortedTodos = getFilter(todos, sortField);
  // const everyTodosCompleted = todos.every(todo => todo.completed);

  const onDelete = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    return getDelete(todoId).catch(error => {
      setTodos(todos);
      setErrorMessage(ErrorType.UnableDelete);
      throw error;
    });
  };

  const onAdd = ({ title, completed, userId }: Todo) => {
    setErrorMessage(null);

    return getAdd({ title, completed, userId })
      .then(newPost => {
        setTodos(currentTodos => [...currentTodos, newPost]);
      })
      .catch(error => {
        setErrorMessage(ErrorType.UnableAdd);
        throw error;
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Form
          onSubmit={onAdd}
          setErrorMessage={setErrorMessage}
          activeInput={activeInput}
        />

        <Todos todos={sortedTodos} onDelete={onDelete} />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            sortField={sortField}
            setSortField={setSortField}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
