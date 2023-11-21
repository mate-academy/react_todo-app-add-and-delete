/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import * as todosServise from './api/todos';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodosContext } from './TodosContext';
import { USER_ID } from './helpers/helpers';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { actions } from './helpers/reducer';

export const TodoApp: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const {
    todos,
    dispatch,
    setErrorMessage,
  } = useContext(TodosContext);

  useEffect(() => {
    todosServise.getTodos(USER_ID)
      .then((loadTodos) => {
        dispatch(actions.load(loadTodos));
      })
      .catch((error) => {
        setErrorMessage('Unable to load todos');
        throw error;
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodos = (newtitle: string) => {
    const temporaryTodo = {
      id: 0,
      title: newtitle,
      userId: USER_ID,
      completed: false,
    };

    const newTodo: Omit<Todo, 'id'> = {
      title: newtitle,
      userId: 11822,
      completed: false,
    };

    setErrorMessage('');
    setIsSubmitting(true);
    setTempTodo(temporaryTodo);

    todosServise.createTodos(newTodo)
      .then(todo => dispatch(actions.add(todo)))
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .then(() => setTitle(''))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  // const updateTodo = (updatedTodo: Todo) => {
  //   todosServise.updateTodo(updatedTodo)
  //     .then(todo => setTodos(currentTodos => {
  //       const newTodos = [...currentTodos];
  //       const index = newTodos.findIndex(t => t.id === updatedTodo.id);

  //       return newTodos.splice(index, 1, todo);
  //     }))
  //     .catch(() => {
  //       setErrorMessage('Unable to update a todo');
  //       setIsVisible(true);
  //     });
  // };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodos}
          setTitle={setTitle}
          title={title}
          isSubmitting={isSubmitting}
        />

        <TodoList tempTodo={tempTodo} isSubmitting={isSubmitting} />

        {todos.length > 0 && (
          <Footer />
        )}
      </div>

      <Error />
    </div>
  );
};
