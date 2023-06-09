import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { FormTodo } from './component/FormTodo/FormTodo';
import { MainTodoList } from './component/MainTodo/MainTodoList';
import { Footer } from './component/Footer/Footer';
import { Error } from './component/Error/Error';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { FilterByWords } from './types/enums';

const USER_ID = 10599;

export const App: React.FC = () => {
  const [todos, setFormValue] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterByWords.All);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setFormValue)
      .catch((err: Error) => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    if (tempTodo) {
      setTempTodo(null);
    }
  }, [todos]);

  const addNewTodo = (newTodo: string) => {
    if (newTodo.trim() === '') {
      setError("Title can't be empty");

      return;
    }

    setIsInputDisabled(true);
    setTempTodo({
      id: 0,
      title: newTodo,
      completed: false,
      userId: USER_ID,
    });

    client
      .post(`/todos?userId=${USER_ID}`, {
        title: newTodo,
        completed: false,
        userId: USER_ID,
      })
      .then((response) => {
        const newTodos = Array.isArray(response) ? response[0] : response;

        setFormValue((prevTodos) => [...prevTodos, newTodos]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const deleteToDo = (todoId: number) => {
    client
      .delete(`/todos/${todoId}`)
      .then(() => {
        setFormValue((prevTodos) => prevTodos
          .filter((todo) => todo.id !== todoId));
      })
      .catch((err) => {
        setError(err);
      });
  };

  const copyTodoArray = useMemo(() => {
    switch (filterStatus) {
      case FilterByWords.Active:
        return todos.filter((elem) => !elem.completed);
      case FilterByWords.Completed:
        return todos.filter((elem) => elem.completed);
      default:
        return todos;
    }
  }, [filterStatus, todos]);

  const closeErrorBanner = (value: string) => {
    setError(value);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <FormTodo
          addNewTodo={addNewTodo}
          isInputDisabled={isInputDisabled}
        />

        <MainTodoList
          todos={copyTodoArray}
          deleteToDo={deleteToDo}
          tempTodo={tempTodo}
        />
        {todos.length > 0 ? (
          <footer className="todoapp__footer">
            <Footer
              setFilterHandler={setFilterStatus}
              todoCounter={copyTodoArray.length}
            />
          </footer>
        ) : null}
      </div>

      <Error error={error} closeErrorBanner={closeErrorBanner} />
    </div>
  );
};
