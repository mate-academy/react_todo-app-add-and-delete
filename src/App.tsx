/* eslint-disable no-console */
import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { Todo, SortType } from './Types';
import { UserWarning } from './UserWarning';
import { getTodos } from './todos';
import { client } from './utils/client';
import { ErrorMessage } from './components/ErrorMessages';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

const USER_ID = 10377;

function getRandomNumber(): number {
  return Math.floor(Math.random() * 1001);
}

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [selectedTab, setSelectedTab] = useState(SortType.All);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThereActiveTodo, setIsThereActiveTodo] = useState(false);
  const [isThereCompletedTodos, setIsThereCompletedTodos] = useState(false);
  const [isHidden, setIsHidden] = useState('');
  const [isThereIssue, setIsThereIssue] = useState(false);
  const [numberOfActiveTodos, setNumberOfActivTodos] = useState(0);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [editTodo, setEditTodo] = useState('');
  const [tempTodo, setTempTodo] = useState({
    title: '',
    userId: USER_ID,
    completed: false,
    id: getRandomNumber(),
  });
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await getTodos(USER_ID);

      setTodo(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Unable to add a todo');
      setIsHidden('Unable to add a todo');
      setIsThereIssue(true);
      timeoutId.current = setTimeout(() => {
        setIsThereIssue(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const updatetempTodo = (value: string) => {
    value.trim();

    setInputValue(value);

    setTempTodo({
      ...tempTodo,
      title: inputValue.trim(),
      id: getRandomNumber(),
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() !== '') {
      const tempTodoItem: Todo = {
        title: inputValue.trim(),
        userId: USER_ID,
        completed: false,
        id: getRandomNumber(),
      };

      try {
        await client.post('/todos', tempTodoItem);
        setTodo((prevTodo) => [...prevTodo, tempTodoItem]);
      } catch (error) {
        console.log('There is an error', error);
      }
    } else {
      // setErrorMessageField(true);
    }

    setInputValue('');
  };

  const deleteTodo = async (id: number) => {
    const tempTodos = todo.filter((element) => {
      return element.id !== id;
    });

    setTodo(tempTodos);

    try {
      await client.delete(`/todos/${id}`);
    } catch (error) {
      console.log('There is an issue.', error);
      setDeleteErrorMessage('Unable to delete a todo');
    }
  };

  const updateAllTodo = async () => {
    const everyCompleted = todo.every((item) => item.completed);

    const updatedTodos = todo.map((element) => {
      return everyCompleted
        ? ({
          ...element,
          completed: !element.completed,
        }) : (
          {
            ...element,
            completed: true,
          }
        );
    });

    setTodo(updatedTodos);

    try {
      updatedTodos.map(async (todoItem) => {
        await client.patch(`/todos/${todoItem.id}`, {
          ...todoItem,
          completed: todoItem.completed,
        });
      });
    } catch (error) {
      console.log('There is an issue updating todos.', error);
    }
  };

  const updateIndividualTodo = async (id: number) => {
    const updatedTodo = todo.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          completed: !obj.completed,
        };
      }

      return obj;
    });

    const none = todo.some((element) => {
      return element.id === id;
    });

    if (!none) {
      // setIsEditingTodoAllowed(true);
      // setErrorMessageField(true);
      setEditTodo('Unable to loading a todo');
      setIsThereIssue(true);
    }

    setTodo(updatedTodo);

    try {
      const todoToUpdate = todo.find((elem) => elem.id === id);

      if (todoToUpdate) {
        await client.patch(`/todos/${id}`, {
          completed: !todoToUpdate.completed,
          title: todoToUpdate.title,
          userId: USER_ID,
          id,
        });
      }
    } catch (error) {
      setDeleteErrorMessage('Unable to delete a todo');
      console.log('There is an issue.');
    }
  };

  useEffect(() => {
    fetchTodos();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    const isActive = todo.some((obj) => obj.completed === false);
    const isCompleted = todo.some((obj) => obj.completed === true);
    const todoLength = todo.filter((obj) => {
      return obj.completed === false;
    });

    setIsThereActiveTodo(isActive);
    setIsThereCompletedTodos(isCompleted);
    setNumberOfActivTodos(todoLength.length);
  }, [todo]);

  const visibleTodos: Todo[] = useMemo(() => todo.filter((element) => {
    switch (selectedTab) {
      case SortType.Completed:
        return element.completed;
      case SortType.Active:
        return !element.completed;
      case SortType.All:
        return todo;
      default:
        return todo;
    }
  }), [todo, selectedTab]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            isThereActiveTodo={isThereActiveTodo}
            updateAllTodo={updateAllTodo}
            handleFormSubmit={handleFormSubmit}
            inputValue={inputValue}
            updatetempTodo={updatetempTodo}
          />
          <section className="todoapp__main">
            <TodoList
              todo={todo}
              visibleTodos={visibleTodos}
              isLoading={isLoading}
              tempTodo={tempTodo}
              updateIndividualTodo={updateIndividualTodo}
              deleteTodo={deleteTodo}
            />
          </section>
          {todo.length > 0 && (
            <Footer
              numberOfActiveTodos={numberOfActiveTodos}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              isThereCompletedTodos={isThereCompletedTodos}
              todo={todo}
              setTodo={setTodo}
              setDeleteErrorMessage={setDeleteErrorMessage}
            />
          )}

        </div>

        <ErrorMessage
          message={isHidden}
          deleteErrorMessage={deleteErrorMessage}
          isThereIssue={isThereIssue}
          editTodo={editTodo}
          setIsThereIssue={setIsThereIssue}
        />
      </div>
    </>
  );
};
