/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import ErrorNotifacations from './components/errorNotifacations';
import Footer from './components/footer';
import TodoList from './components/todoList';
import Header from './components/header';
import { Todo } from './types/Todo';
import { filterData } from './helpers/filterData';
import { ErrorMesagges, FilterOptions } from './types/enums';
import { deleteTodos } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState<ErrorMesagges>(
    ErrorMesagges.defaultValue,
  );
  const [filterTypeValue, setFilterTypeValue] = useState<FilterOptions>(
    FilterOptions.All,
  );

  const [deletingIds, setDeletingIds] = useState<number[] | []>([]);

  const handleSetfilterType = (value: FilterOptions) => {
    setFilterTypeValue(value);
  };

  const filteredTodos = filterData(todos, filterTypeValue);

  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(ErrorMesagges.UnableLoad);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(ErrorMesagges.defaultValue);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  //delete one Item
  const handleDelete = async (todoId: number) => {
    try {
      const response = await deleteTodos(todoId);

      if (response) {
        setTodos(prev => prev.filter(x => x.id !== todoId));
      }
    } catch (e) {
      setErrorMessage(ErrorMesagges.UnableDelete);
    } finally {
      setDeletingIds([]);
    }
  };

  const completedItems = todos.filter(x => x.completed === true);
  const completedLength = completedItems.length;

  //delete completed Items
  const handleDeleteCompleted = () => {
    completedItems.forEach(item => {
      handleDelete(item.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          // tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              onDelete={handleDelete}
              deletingIds={deletingIds}
              setDeletingIds={setDeletingIds}
            />
            <Footer
              onSetfilterType={handleSetfilterType}
              handleDeleteCompleted={handleDeleteCompleted}
              completedLength={completedLength}
            />
          </>
        )}
      </div>

      <ErrorNotifacations isError={errorMessage} />
    </div>
  );
};
