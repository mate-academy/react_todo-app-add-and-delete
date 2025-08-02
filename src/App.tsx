import React, { useEffect, useMemo, useState } from 'react';
import { Footer } from './components/footer/Footer';
import { ErrorMessage } from './components/errorMessage/Error';
import { Header } from './components/header/Header';
import { TodoList } from './components/todoList/TodoList';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  enum FILTERS {
    all = 'all',
    completed = 'completed',
    active = 'active',
  }

  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [shouldFocus, setShouldFocus] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => {
    return todoList.filter(todo => {
      switch (filter) {
        case FILTERS.completed:
          return todo.completed === true;
        case FILTERS.active:
          return todo.completed === false;
        default:
          return true;
      }
    });
  }, [todoList, filter, FILTERS.completed, FILTERS.active]);

  const completedTodos = useMemo(() => {
    return todoList.filter(todo => todo.completed === true);
  }, [todoList]);

  const unCompletedCount = useMemo(() => {
    return todoList.filter(todo => todo.completed === false).length;
  }, [todoList]);

  //  перша загрузка данних на сторінку
  useEffect(() => {
    getTodos()
      .then(data => {
        setTodoList(data);
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  // прибираємо помилку через 3 секунди, а після вже видаляємо таймер
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // обробка фільтрів
  const handleFilter = (query: string) => {
    setFilter(query);
  };

  const addPost = (title: string) => {
    setError(null); // очищаємо помилку, якщо вона була
    setShouldFocus(false); // вимикаємо фокус на інпуті
    setTempTodo({
      id: 0,
      userId: 3217,
      title: title,
      completed: false,
    });

    return addTodo(title)
      .then(newPost => {
        setTodoList(prevList => [...prevList, newPost]);
        setTempTodo(null);
        setShouldFocus(true); // знову вмикаємо фокус на інпуті
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
        setShouldFocus(true);

        return Promise.reject();
      });
  };

  // видалення todo
  const deletePost = (postId: number) => {
    setError(null);
    setShouldFocus(false);

    return deleteTodo(postId)
      .then(() => {
        setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== postId));
        setShouldFocus(true);
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setShouldFocus(true);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          toggleAll={unCompletedCount}
          addPost={addPost}
          setError={setError}
          shouldFocus={shouldFocus}
        />

        <TodoList
          todoList={filteredTodos}
          todoTemp={tempTodo}
          deleteTodo={deletePost}
        />

        {todoList.length > 0 && (
          <Footer
            filter={handleFilter}
            unCompletedCount={unCompletedCount}
            completed={completedTodos}
            deleteAll={deletePost}
          />
        )}
      </div>

      <ErrorMessage error={error} hideError={setError} />
    </div>
  );
};
