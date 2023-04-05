/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { Header } from './Components/Header';
import { TodoList } from './Components/Todolist';
import { Footer } from './Components/Footer';
import { Notification } from './Components/Notification';

const USER_ID = 6342;

const temp = {
  id: 0,
  userId: 0,
  title: '',
  completed: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasErrorFromServer, setHasErrorFromServer] = useState(false);
  const [deletedId, setDeletedId] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo>(temp);
  const [added, setAdded] = useState(false);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (selectedStatus) {
        case 'all':
          return true;
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [selectedStatus, todos]);

  const fetchTodos = async () => {
    try {
      setHasErrorFromServer(false);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setHasErrorFromServer(true);
      setErrorMessage('fetch');
      setTodos((state) => [...state]);
    }
  };

  const addTodo = async (title: string) => {
    setTempTodo((state) => ({
      ...state,
      title,
    }));
    setAdded(true);
    setSearchQuery('');
    try {
      setHasErrorFromServer(false);
      const addedResultFromServer = await addTodos(USER_ID, {
        title,
        userId: USER_ID,
        completed: false,
      });

      if (addedResultFromServer) {
        fetchTodos();
        setTempTodo((state) => ({
          ...state,
          title: '',
        }));
        setAdded(false);
      }
    } catch {
      setHasErrorFromServer(true);
      setErrorMessage('add');
      setAdded(false);
      setTodos((state) => [...state]);
    }
  };

  const onEmpty = () => {
    setHasErrorFromServer(true);
    setErrorMessage('Title can\'t be empty');
  };

  const todoDelete = async (todoId: number) => {
    setDeletedId(todoId);
    try {
      const deleteResultFromServer = await deleteTodos(todoId);

      if (deleteResultFromServer) {
        fetchTodos();
      }
    } catch {
      setHasErrorFromServer(true);
      setErrorMessage('delete');
      setDeletedId(0);
    }
  };

  const clearNotification = () => {
    setHasErrorFromServer(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          addTodo={addTodo}
          onEmpty={onEmpty}
          added={added}
        />
        <TodoList
          todosToShow={filteredTodos}
          todoDelete={todoDelete}
          deletedId={deletedId}
          tempTodo={tempTodo}
          added={added}
        />
        {todos.length > 0 && (
          <Footer
            todosToShow={filteredTodos}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        )}
      </div>
      <Notification
        hasErrorFromServer={hasErrorFromServer}
        clearNotification={clearNotification}
        errorMessage={errorMessage}
      />
    </div>
  );
};
