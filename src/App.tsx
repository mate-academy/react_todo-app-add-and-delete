/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { Header } from './components/header/Header';
import { List } from './components/list/List';
import { Footer } from './components/footer/Footer';
import { UserWarning } from './UserWarning';
import { Warnings } from './components/warnings/Warnings';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 10514;

const { All, Active, Completed } = TodoFilter;

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(All);
  const [error, setError] = useState('');
  const [processings, setProcessings] = useState<number[]>([]);

  const loadTodos = () => {
    getTodos(USER_ID)
      .then((todos) => setTodoList(todos))
      .catch(() => setError(ErrorMessage.Get));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => setError(''), 3000);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function filterList() {
    switch (filterBy) {
      case Active:
        return todoList.filter((todo: Todo) => !todo.completed);

      case Completed:
        return todoList
          .filter((todo: Todo) => !todo.id || todo.completed);

      default:
        return todoList;
    }
  }

  function getactiveId(id : number | null) {
    !id ? setProcessings([]) : setProcessings(prev => [...prev, id]);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodoList={setTodoList}
          todoList={todoList}
          setError={setError}
          setProcessings={(id) => getactiveId(id)}
        />

        <List
          setTodoList={setTodoList}
          todoList={filterList()}
          setError={setError}
          setProcessings={(id) => getactiveId(id)}
          processings={processings}

        />

        {todoList.length !== 0 && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            todoList={todoList}
            setTodoList={setTodoList}
            setError={setError}
            setProcessings={(id) => getactiveId(id)}
          />
        )}
      </div>
      <Warnings error={error} setError={setError} />
    </div>
  );
};
