import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notification/Notification';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import { Filters } from './types/Filters';

function filterBy(todos: Todo[], filterCriteria = Filters.ALL) {
  switch (filterCriteria) {
    case Filters.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case Filters.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<Filters>(Filters.ALL);

  const filteredTodos = useMemo(
    () => filterBy(todos, filterCriteria),
    [filterCriteria, todos],
  );

  const uncompletedTodos = useMemo(
    () => filterBy(todos, Filters.ACTIVE),
    [todos],
  );

  const completedTodos = useMemo(
    () => filterBy(todos, Filters.COMPLETED),
    [todos],
  );

  const [notificationText, setNotificationText] = useState('');

  const notificationID = useRef(setTimeout(() => {}));

  const handleNotification = (errorMessage: string) => {
    setNotificationText(errorMessage);

    clearInterval(notificationID.current);
    notificationID.current = setTimeout(() => setNotificationText(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(response => {
        setTodos(response);
      })
      .catch(() => {
        handleNotification('Unable to load todos');
      });
  }, []);

  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function handleSubmit(inputQuery: string) {
    if (!inputQuery.trim()) {
      handleNotification('Title should not be empty');

      return;
    }

    const requestedTodo = {
      id: 0,
      title: inputQuery.trim(),
      userId: USER_ID,
      completed: false,
    };

    setIsDisabled(true);

    setTempTodo(requestedTodo);

    return postTodo(requestedTodo)
      .then(response => {
        setTodos([...todos, response]);

        return true;
      })
      .catch(() => {
        handleNotification('Unable to add a todo');

        return false;
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  }

  const [deleteQueue, setDeleteQueue] = useState<Todo[]>([]);

  const handleDelete = async (todo: Todo) => {
    try {
      await deleteTodo(todo.id);

      setTodos(oldTodos => oldTodos.filter(todoFilter => todoFilter !== todo));
    } catch {
      handleNotification('Unable to delete a todo');
    } finally {
      setDeleteQueue(deleteQueue.filter(todoQueue => todoQueue !== todo));
    }
  };

  const handleClear = () => {
    setDeleteQueue(completedTodos);
    completedTodos.forEach(todo => handleDelete(todo));
  };

  const [toggleQueue, setToggleQueue] = useState<Todo[]>([]);

  const handleToogle = async (todo: Todo) => {
    try {
      await patchTodo(todo.id, {
        completed: !todo.completed,
      });

      const foundTodo = todos.find(todoToFind => todoToFind === todo);

      if (foundTodo) {
        foundTodo.completed = !foundTodo.completed;
      }

      setTodos(oldTodos => [...oldTodos]);
    } catch {
      handleNotification('Unable to update a todo');
    } finally {
      setToggleQueue(toggleQueue.filter(todoQueue => todoQueue !== todo));
    }
  };

  const handleToggleAll = () => {
    if (
      todos.every(todo => todo.completed === true) ||
      todos.every(todo => todo.completed === false)
    ) {
      setToggleQueue(todos);
      todos.forEach(todo => handleToogle(todo));
    } else {
      const uncompletedTodosToToggle = todos.filter(
        todo => todo.completed === false,
      );

      setToggleQueue(uncompletedTodosToToggle);
      uncompletedTodosToToggle.forEach(todo => handleToogle(todo));
    }
  };

  const handleUpdate = async (todo: Todo, newTitle: string) => {
    try {
      await patchTodo(todo.id, {
        title: newTitle,
      });

      const foundTodo = todos.find(todoToFind => todoToFind === todo);

      if (foundTodo) {
        foundTodo.title = newTitle;
      }

      setTodos(oldTodos => [...oldTodos]);

      return true;
    } catch {
      handleNotification('Unable to update a todo');

      return false;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          isDisabled={isDisabled}
          todos={todos}
          onToggleAll={handleToggleAll}
        />
        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDelete}
            deleteQueue={deleteQueue}
            onToggle={handleToogle}
            toggleQueue={toggleQueue}
            handleUpdate={handleUpdate}
          />
        )}
        {todos.length > 0 && (
          <Footer
            uncompletedTodos={uncompletedTodos}
            completedTodos={completedTodos}
            filterBy={setFilterCriteria}
            onClear={handleClear}
          />
        )}
      </div>

      <Notification
        notificationText={notificationText}
        onClose={() => setNotificationText('')}
      />
    </div>
  );
};
