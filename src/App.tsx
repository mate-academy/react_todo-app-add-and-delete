/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as PostService from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/FilterEnum';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './types/ErrorMessageEnum';
import { TodoContext } from './TodoContext';
import { Header } from './Header';
import { Errors } from './Errors/Errors';

const USER_ID = 11589;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorOccured, setErrorOccured] = useState('');
  const [filterBy, setFilterBy] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoChange, setIsTodoChange] = useState(false);
  const [changingItems, setChangingItems] = useState<number[]>([]);

  useEffect(() => {
    PostService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorOccured(ErrorMessage.noTodos);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      });
  }, []);

  const handleDelete = (todo: Todo) => {
    setIsTodoChange(true);
    setChangingItems(current => [...current, todo.id]);

    return PostService.deleteTodo(todo.id)
      .then(() => setTodos(todos.filter(item => item.id !== todo.id)))
      .catch(() => {
        setTodos(todos);
        setErrorOccured(ErrorMessage.noDeleteTodo);
        setIsTodoChange(false);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      })
      .finally(() => {
        setIsTodoChange(false);
        setChangingItems([]);
      });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorOccured(ErrorMessage.noTitle);
      setTimeout(() => {
        setErrorOccured('');
      }, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setChangingItems(current => [...current, 0]);
    setIsTodoChange(true);

    setTempTodo(newTodo);

    // setInputDisabled(true);

    PostService.createTodo(newTodo)
      .then((createdTodo) => {
        setTodos([...todos, createdTodo]);
        setTitle('');
        setChangingItems([]);
      })
      .catch(() => {
        setErrorOccured(ErrorMessage.noAddTodo);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      })
      .finally(() => {
        setIsTodoChange(false);
        setTempTodo(null);
      });
  };

  const handleFilterTodos = () => {
    switch (filterBy) {
      case Status.All:
        return todos;
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const preparedTodos = handleFilterTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoContext.Provider value={{
          todos,
          preparedTodos,
          setTodos,
          setFilterBy,
          filterBy,
          errorOccured,
          setErrorOccured,
          USER_ID,
          setTitle,
          title,
          handleSubmit,
          handleDelete,
          isTodoChange,
          changingItems,
        }}
        >
          <Header />
          <TodoList
            todos={preparedTodos}
            tempTodo={tempTodo}
          />

          {/* Hide the footer if there are no todos */}
          {todos.length !== 0 && (
            <Footer />
          )}

          <Errors />
        </TodoContext.Provider>
      </div>
    </div>
  );
};
