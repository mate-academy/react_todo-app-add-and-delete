/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as apiServiceTodos from './api/todos';
import { Error } from './component/Error';
import { Footer } from './component/Footer';
import { MainTodo } from './component/MainTodo';
import { Header } from './component/Header';
import { Filter } from './utils/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  // const toggleTodo = (id: number) => {
  //   setTodos(prevTodos =>
  //     prevTodos.map(todo =>
  //       todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  //     ),
  //   );
  // };

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.All) {
      return true;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return !todo.completed;
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setLoading(true);
    setLoadingTodoId(null);

    return apiServiceTodos
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(cur => [...cur, newTodo]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId(null);
      });
  }

  function deleteTodos(todoId: number) {
    setLoadingTodoId(todoId);

    return apiServiceTodos
      .deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setLoadingTodoId(null));
  }

  // function updateTodo(updatedTodo: Todo) {
  //   apiServiceTodos.updateTodo(updatedTodo).then(todo => {
  //     setTodos(currentTodos => {
  //       const newTodos = [...currentTodos];
  //       // eslint-disable-next-line @typescript-eslint/no-shadow
  //       const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

  //       newTodos.splice(index, 1, todo);

  //       return newTodos;
  //     });
  //   });
  // }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function loadTodo() {
    setError('');
    setLoading(true);

    apiServiceTodos
      .getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTodo();
  }, []);

  const onClear = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo =>
        apiServiceTodos
          .deleteTodo(todo.id)
          .then(() =>
            setTodos(current => current.filter(t => t.id !== todo.id)),
          )
          .catch(() => setError('Unable to delete a todo')),
      ),
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          allCompleted={todos.length > 0 && todos.every(t => t.completed)}
          loading={loading}
        />

        <MainTodo
          todos={todos}
          filteredTodos={filteredTodos}
          deleteTodo={deleteTodos}
          tempTodo={tempTodo}
          loadingTodoId={loadingTodoId}
        />
        <Error error={error} onCloseError={() => setError('')} />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClear={onClear}
          />
        )}
      </div>
    </div>
  );
};
