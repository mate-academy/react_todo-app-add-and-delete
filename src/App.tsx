import { useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, postTodo, updateTodo, USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [todosFilter, setTodosFilter] = useState<FilterType>(FilterType.All);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todoBeingAdded, setTodoBeingAdded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearInput, setClearInput] = useState(false);

  const defaultInputRef = useRef<HTMLInputElement>(null);
  const focusedTodoRef = useRef<HTMLInputElement>(null);
  const didLoad = useRef(false);

  const focusDefaultInput = () => {
    if (defaultInputRef.current) {
      defaultInputRef.current.focus();
    }
  };

  const showError = (message: string) => {
    if (message) {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const getAndShowTodos = () => {
    getTodos()
      .then(todos => {
        setCurrentTodos(todos);
      })
      .catch(() => {
        showError('Unable to load todos');
      })
      .finally(() => {
        setTimeout(focusDefaultInput, 0);
      });
  };

  if (!didLoad.current) {
    didLoad.current = true;
    setTimeout(getAndShowTodos, 0);
  }

  const filterTodos = (filter: FilterType): Todo[] => {
    if (filter === FilterType.Active) {
      return currentTodos.filter(todo => !todo.completed);
    }

    if (filter === FilterType.Completed) {
      return currentTodos.filter(todo => todo.completed);
    }

    return currentTodos;
  };

  const getCompletedTodos = (): Todo[] =>
    currentTodos.filter(todo => todo.completed);

  const deleteChosenTodo = (todoToDelete: Todo | null) => {
    if (todoToDelete) {
      deleteTodo(todoToDelete)
        .then(() => {
          setCurrentTodos(prev => prev.filter(t => t.id !== todoToDelete.id));
          if (selectedTodo && selectedTodo.id === todoToDelete.id) {
            setSelectedTodo(null);
          }
        })
        .catch(() => showError('Unable to delete a todo'))
        .finally(() => {
          setTimeout(focusDefaultInput, 0);
        });
    }
  };

  const postNewTodo = (todoToPost: Todo | null) => {
    if (todoToPost) {
      setTodoBeingAdded(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoToPost.title,
        completed: todoToPost.completed,
      });
      postTodo(todoToPost)
        .then(postedTodo => {
          setCurrentTodos(prev => [...prev, postedTodo]);
          setClearInput(true);
        })
        .catch(() => showError('Unable to add a todo'))
        .finally(() => {
          setTodoBeingAdded(false);
          setTempTodo(null);
          setTimeout(focusDefaultInput, 0);
        });
    }
  };

  const deleteCompletedTodos = () => {
    const completedTodos = getCompletedTodos();

    if (completedTodos.length === 0) {
      return;
    }

    const deletePromises = completedTodos.map(todo => deleteTodo(todo));

    Promise.allSettled(deletePromises).then(results => {
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          setCurrentTodos(prev =>
            prev.filter(t => t.id !== completedTodos[index].id),
          );
        } else {
          showError('Unable to delete a todo');
        }
      });
      setTimeout(focusDefaultInput, 0);
    });
  };

  const updateChosenTodo = (todoToUpdate: Todo | null) => {
    if (todoToUpdate) {
      updateTodo(todoToUpdate)
        .then(() => {
          setCurrentTodos(prev =>
            prev.map(todo =>
              todo.id === todoToUpdate.id ? todoToUpdate : todo,
            ),
          );
          if (selectedTodo && selectedTodo.id === todoToUpdate.id) {
            setSelectedTodo(null);
          }
        })
        .catch(() => showError('Unable to update a todo'))
        .finally(() => {
          setTimeout(focusDefaultInput, 0);
        });
    }
  };

  const toggleTodoCompletedStatus = () => {
    const completedCount = getCompletedTodos().length;
    const allCompleted = completedCount === currentTodos.length;
    const newStatus = !allCompleted;
    const updatePromises = currentTodos.map(todo => {
      if (todo.completed !== newStatus) {
        return updateTodo({
          id: todo.id,
          title: todo.title,
          userId: USER_ID,
          completed: newStatus,
        });
      }

      return Promise.resolve();
    });

    Promise.allSettled(updatePromises)
      .then(results => {
        let hadError = false;

        results.forEach(result => {
          if (result.status !== 'fulfilled') {
            hadError = true;
            showError('Unable to update a todo');
          }
        });
        if (!hadError) {
          setCurrentTodos(prev =>
            prev.map(todo => ({ ...todo, completed: newStatus })),
          );
        }
      })
      .finally(() => {
        setTimeout(focusDefaultInput, 0);
      });
  };

  const handleToggleAll = () => {
    toggleTodoCompletedStatus();
  };

  const handleClearCompleted = () => {
    deleteCompletedTodos();
  };

  const filteredTodos = filterTodos(todosFilter);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          defaultInputRef={defaultInputRef}
          currentTodos={currentTodos}
          postNewTodo={postNewTodo}
          showError={showError}
          todoBeingAdded={todoBeingAdded}
          clearInput={clearInput}
          setClearInput={setClearInput}
          handleToggleAll={handleToggleAll}
        />
        <TodoList
          filteredTodos={filteredTodos}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          deleteChosenTodo={deleteChosenTodo}
          focusedTodoRef={focusedTodoRef}
          shouldDeleteCompleted={false}
          tempTodo={tempTodo}
          updateChosenTodo={updateChosenTodo}
          shouldToggleAllCompleted={false}
          currentTodos={currentTodos}
        />
        {currentTodos.length !== 0 && (
          <Footer
            currentTodos={currentTodos}
            todosFilter={todosFilter}
            setTodosFilter={setTodosFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
