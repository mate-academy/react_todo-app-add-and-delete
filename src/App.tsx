import React, { useContext, useEffect } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './Footer';
import { Header } from './Header';
import { Status } from './enums/status';
import { Error } from './Error';
import { ContextTodos } from './TodoContext';
import { List } from './List';

export const App: React.FC = () => {
  const {
    tempTodo,
    stat,
    todos,
    // isEdited,
    setTodos,
    setVisibleErr,
    setErrMessage,
    resetErr,
    // editSelectedInput,
  } = useContext(ContextTodos);
  const filteredTodos = (tod: Todo[], type: Status) => {
    switch (type) {
      case Status.active:
        return tod.filter(todo => !todo.completed);
      case Status.completed:
        return tod.filter(todo => todo.completed);

      default:
        return tod;
    }
  };

  const visibleTodos = tempTodo
    ? filteredTodos(tempTodo, stat)
    : filteredTodos(todos, stat);

  const isAnyCompleted = todos.some(todo => todo.completed);

  useEffect(() => {
    const loadTodos = async () => {
      getTodos()
        .then(setTodos)
        .catch(() => {
          setVisibleErr(true);
          setErrMessage('Unable to load todos');
          resetErr();
        });
    };

    loadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <List visibleTodos={visibleTodos} />

        {todos.length > 0 && <Footer isAnyCompleted={isAnyCompleted} />}
      </div>

      <Error />
    </div>
  );
};
