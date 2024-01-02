/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { Header } from './components/Heder/Heder';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { createTodos, deleteTodos, getTodos } from './api/todos';
import { FilterTodos } from './enum/FilterTodos';
import { TodoError } from './enum/TodoError/TodoError';

const USER_ID = 12111;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [chooseFilter, setChooseFilter] = useState<string>(FilterTodos.All);
  const [errorMessage, setErrorMesage] = useState<string | null>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoader, setIsLoader] = useState(false);
  const [quryInput, setQuryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIdDelete, setIsIdDelete] = useState<number | null>(null);
  const [arryDelete, setArryDelete] = useState<number[] | null>([]);

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => setErrorMesage(TodoError.UnableLoad));
  }, []);

  const filterTodos = useMemo(() => todos.filter((todo: Todo) => {
    switch (chooseFilter) {
      case FilterTodos.Active:
        return !todo.completed;

      case FilterTodos.Completed:
        return todo.completed;

      default:
        return todo;
    }
  }), [chooseFilter, todos]);

  const sendTodo = ({ title, completed }: Omit<Todo, 'userId' | 'id'>) => {
    setTempTodo({
      title, completed, id: 0, userId: USER_ID,
    });
    setIsIdDelete(0);
    setIsLoader(true);
    setIsSubmitting(true);

    createTodos({
      title, completed, userId: USER_ID,
    })
      .then((todo) => {
        setTodos((currentTodo) => [...currentTodo, todo]);
        setQuryInput('');
      })
      .catch((error) => {
        setErrorMesage(TodoError.UnableAdd);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoader(false);
        setIsSubmitting(false);
        setIsIdDelete(null);
      });
  };

  const deleteTodo = (id: number) => {
    setIsIdDelete(id);
    setIsLoader(true);
    deleteTodos(id)
      .then(() => setTodos((currentTodos) => currentTodos
        .filter(todo => todo.id !== id)))
      .catch((error) => {
        setErrorMesage(TodoError.UnableDelete);
        throw error;
      })
      .finally(() => {
        setIsLoader(false);
        setIsIdDelete(null);
        setArryDelete(null);
      });
  };

  const deletePerformedTask = () => {
    const idCompleted: number[] = [];

    filterTodos.forEach((todo) => {
      if (todo.completed) {
        idCompleted.push(todo.id);
      }
    });

    idCompleted.map(todo => deleteTodo(todo));

    setArryDelete(idCompleted);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMesage={setErrorMesage}
          sendTodo={sendTodo}
          quryInput={quryInput}
          setQuryInput={setQuryInput}
          isSubmitting={isSubmitting}
        />
        <TodoList
          todos={filterTodos}
          tempTodo={tempTodo}
          isLoader={isLoader}
          deleteTodo={deleteTodo}
          isIdDelete={isIdDelete}
          arryDelete={arryDelete}
        />
        {todos.length !== 0 && (
          <Footer
            setChooseFilter={setChooseFilter}
            todos={filterTodos}
            chooseFilter={chooseFilter}
            deletePerformedTask={deletePerformedTask}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMesage={setErrorMesage}
        />
      )}
    </div>
  );
};
