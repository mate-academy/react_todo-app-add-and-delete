/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

interface NewTodoProps {
  onAddTodo: (title: string) => void;
  handleEmpty: () => void;
}

const NewTodo: React.FC<NewTodoProps> = ({ onAddTodo, handleEmpty }) => {
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setLoading(true);
      try {
        const response = await client.post<Todo>('/todos', {
          userId: 587,
          title: title.trim(),
          completed: false,
        });
        const newTodo = response.data;

        setTempTodo(newTodo);
        setTitle('');
        onAddTodo(newTodo.title);
      } catch (err) {
      } finally {
        setLoading(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } else {
      handleEmpty();
    }
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={inputRef}
          disabled={loading}
        />
      </form>
      {tempTodo && (
        <div className="todoapp__temp-todo">
          <div className="todoapp__loader"></div>
          <span>{tempTodo.title}</span>
        </div>
      )}
    </header>
  );
};

export default NewTodo;
