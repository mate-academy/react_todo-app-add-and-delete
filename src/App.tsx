/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deletePost, setPost } from './api/todos';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Filter } from './types/filter';
import { Errors } from './components/Errors/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [waitSerser, setWaitSerser] = useState(false);
  const [filtered, setFiltered] = useState(Filter.all);
  const [clearTodos, setClearTodos] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(todoses => {
        setTodos(todoses);
      })
      .catch(() => setError('load'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const setPosts = (newPost: Omit<Todo, 'id'>) => {
    setWaitSerser(true);
    setTempTodo({ ...newPost, id: 0 });

    setPost(newPost)
      .then(Post => {
        setTodos(prevTodos => [...prevTodos, Post]);
        setError('');
        setInput('');
      })

      .catch(() => setError('add'))
      .finally(() => {
        setWaitSerser(false);
        setTempTodo(null);
      });
  };

  const deletePosts = (post: Todo) => {
    setWaitSerser(true);
    deletePost(`/todos/${post.id}`)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== post.id)),
      )
      .catch(() => setError('delete'))
      .finally(() => setWaitSerser(false));
  };

  const clearCompleted = () => {
    setWaitSerser(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setClearTodos(completedIds);
    const deletePromeses = completedTodos.map(todo =>
      deletePost(`/todos/${todo.id}`)
        .then(() => todo.id)
        .catch(() => setError('delete')),
    );

    Promise.all(deletePromeses)
      .then(deletedIds => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => !deletedIds.includes(todo.id)),
        );
        setError('');
        setClearTodos([]);
      })
      .catch(() => setError('delete'))
      .finally(() => setWaitSerser(false));
  };

  const filteredTodos = todos.filter(todo => {
    if (filtered === Filter.active) {
      return !todo.completed;
    } else if (filtered === Filter.completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          input={input}
          setInput={setInput}
          setError={setError}
          setPosts={setPosts}
          todos={todos}
          inputDisabled={waitSerser}
        />
        <Main
          todos={filteredTodos}
          loader={waitSerser}
          tempTodo={tempTodo}
          deletePosts={deletePosts}
          clearTodos={clearTodos}
        />
        {!!todos.length && (
          <Footer
            todos={todos}
            filtered={filtered}
            setFiltered={setFiltered}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <Errors error={error} setError={setError} />
    </div>
  );
};
