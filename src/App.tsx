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
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [titleNew, setTitleNew] = useState('');
  const [isSubmitingNewTodo, setIsSubmitingNewTodo] = useState(false);

  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [sortField, setSortField] = useState(SortType.All);

  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  }, []);

  useEffect(() => {
    activeInput.current?.focus();
  }, [todos, errorMessage]);

  const sortedTodos = getFilter(todos, sortField);

  const onDelete = (todoId: number) => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(false);

    return getDelete(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorType.UnableDelete);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        // setTodos(todos);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const createNewTodo = () => {
    if (!titleNew.trim()) {
      setErrorMessage(ErrorType.EmptyTitle);

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      title: titleNew.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    setIsSubmitingNewTodo(true);

    getAdd(newTodo)
      .then(created => {
        setTodos(currentTodos => [...currentTodos, created]);
        setTitleNew('');
      })
      .catch(() => {
        setErrorMessage(ErrorType.UnableAdd);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitingNewTodo(false);
      });
  };

  const clearCompleted = () => {
    return todos.filter(todo => todo.completed).map(todo => onDelete(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Form
          titleNew={titleNew}
          setTitleNew={setTitleNew}
          createNewTodo={createNewTodo}
          activeInput={activeInput}
          isSubmitingNewTodo={isSubmitingNewTodo}
        />

        <Todos
          todos={sortedTodos}
          onDelete={isDeleting ? () => {} : onDelete}
        />

        {tempTodo && (
          <TodoItem todo={tempTodo} onDelete={onDelete} isTemp={true} />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            sortField={sortField}
            setSortField={setSortField}
            clearCompleted={clearCompleted}
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
