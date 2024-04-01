import { useState } from 'react';
import { AddTodoInput } from '../AddTodoInput';
import { useTodosContext } from '../../hooks/useTodosContext';
import { Errors } from '../../enums/Errors';
import { USER_ID, createTodo } from '../../api/todos';

export const AddTodoForm: React.FC = () => {
  const {
    showError,
    setTodos,
    setTempTodo,
    setLoadingTodoIds,
    setIsFocusedInput,
  } = useTodosContext();

  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmiting(true);

    if (!title.trim().length) {
      showError(Errors.EmptyTitle);
      setIsSubmiting(false);
    } else {
      const newTodo = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      createTodo(newTodo)
        .then(reponse => {
          setTodos(prevTodos => [...prevTodos, reponse]);
          setTitle('');
          setTempTodo(null);
          setLoadingTodoIds([]);
          setIsFocusedInput(true);
        })
        .catch(() => {
          showError(Errors.AddTodo);
          setTempTodo(null);
          setLoadingTodoIds([]);
          setIsFocusedInput(true);
        })
        .finally(() => {
          setIsSubmiting(false);
        });

      const tempTodo = {
        id: 0,
        ...newTodo,
      };

      setTempTodo(tempTodo);
      setLoadingTodoIds([tempTodo.id]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AddTodoInput
        title={title}
        onTitleChange={setTitle}
        isSubmiting={isSubmiting}
      />
    </form>
  );
};
