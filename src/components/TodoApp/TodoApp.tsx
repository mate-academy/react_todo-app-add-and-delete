import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { Status } from '../../types/Status';
import { TodoHeader } from '../TodoHeader';
import { ErrorNotification } from '../ErrorNotification';
import { ToDo } from '../../types/ToDo';
import { TodoItem } from '../TodoItem';
import { client } from '../../utils/fetchClient';

const USER_ID = 11715;

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<ToDo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');

  const changeTitle = (value: string) => setTitle(value);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    client.get<ToDo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => {
        showErrorMessage('Unable to load todos');
      });
  }, [setTodos]);

  const resetErrorMessage = () => setErrorMessage('');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Status.Completed:
        return todos.filter(el => el.completed);
      case Status.Active:
        return todos.filter(el => !el.completed);
      case Status.All:
      default:
        return todos;
    }
  }, [filter, todos]);

  const addTodo = () => {
    const trimTitle = title.trim();

    if (trimTitle.length === 0) {
      showErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      completed: false,
      userId: USER_ID,
      title: trimTitle,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    client.post<ToDo>('/todos', newTodo)
      .then(data => {
        setTitle('');
        setTodos(currentTodos => [...currentTodos, data]);
      })
      .catch(() => {
        showErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const clearCompleted = () => {
    const copyTodo = [...todos];

    setTodos(todos.filter(el => !el.completed));

    const promises: Array<Promise<unknown>> = [];

    copyTodo.filter(({ completed }) => completed)
      .map(({ id }) => id)
      .forEach((id) => {
        promises.push(client.delete(`/todos/${id}`));
      });

    Promise.allSettled(promises)
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
      });
  };

  const updateTodo = (id: number, newTitle: string) => {
    setTodos(todos.map(prevTodo => (prevTodo.id === id
      ? { ...prevTodo, title: newTitle }
      : prevTodo)));
  };

  const removeTodo = (id: number) => {
    client.delete(`/todos/${id}`)
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      });

    setTodos(todos.filter(el => el.id !== id));
  };

  const markAsComplete = (id: number) => {
    setTodos(todos.map(
      (todo) => (todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo),
    ));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          title={title}
          tempTodo={tempTodo}
          changeTitle={changeTitle}
          addTodo={addTodo}
        />

        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            updateTodo={updateTodo}
            removeTodo={removeTodo}
            markAsComplete={markAsComplete}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            updateTodo={updateTodo}
            removeTodo={removeTodo}
            markAsComplete={markAsComplete}
          />
        )}

        {!!todos.length && (
          <TodoFooter
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        resetMessage={resetErrorMessage}
      />
    </div>
  );
};
