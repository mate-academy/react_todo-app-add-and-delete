import React, { useEffect, useState } from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage, Filterby, Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { ErrorModal } from './components/ErrorModal/ErrorModal';

const filter = (todos: Todo[], filterBy: Filterby) => {
  switch (filterBy) {
    case Filterby.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case Filterby.COMPLETED:
      return todos.filter(todo => todo.completed);
    case Filterby.ALL:
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorMessage.NONE);
  const [filterBy, setFilterBy] = useState(Filterby.ALL);
  const [newTitle, setNewTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError(ErrorMessage.LOAD);
      });
  }, []);

  const filteredTodos = filter(todos, filterBy);

  function handleAddTodo({ id, title, userId, completed }: Todo) {
    if (!newTitle.trim()) {
      setError(ErrorMessage.EMPTY);

      return;
    }

    setLoading(true);

    setTempTodo({ id, title, userId, completed });

    return addTodo({ title, userId, completed })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.ADD);
      })
      .finally(() => {
        setNewTitle('');
        setTempTodo(null);
        setLoading(false);
      });
  }

  function handleDeleteTodo(id: number) {
    setLoadingTodo(currentIds => [...currentIds, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setError(ErrorMessage.DELETE))
      .finally(() => {
        setLoadingTodo(prev => prev.filter(prevId => prevId !== id));
      });
  }

  function handleDeleteComplited() {
    const complitedTodo = todos.filter(todo => todo.completed);
    const idsDelete = complitedTodo.map(todo => todo.id);

    if (complitedTodo.length === 0) {
      return;
    }

    setLoadingTodo(idsDelete);

    complitedTodo.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => setError(ErrorMessage.DELETE))
        .finally(() => {
          setLoadingTodo([]);
        });
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          handleAddTodo={handleAddTodo}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          loading={loading}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodo={loadingTodo}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteComplited={handleDeleteComplited}
          />
        )}
      </div>
      <ErrorModal
        errorMessage={error}
        onClearError={() => setError(ErrorMessage.NONE)}
      />
    </div>
  );
};
