import { ChangeEvent, FC } from 'react';
import classNames from 'classnames';

type Props = {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
};

const Input:FC<Props> = ({
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  loading = false,
  required = false,
  error = false,
  disabled = false,
  errorText = '',
}) => {
  return (
    <div className="field">
      <label className="label" htmlFor={`${label}-input`}>
        {label}
      </label>

      <div
        className={classNames('control has-icons-left', {
          'is-loading': loading,
        })}
      >
        <input
          type={type}
          id={`${label}-input`}
          className={classNames('input', {
            'is-danger': error,
          })}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          required={required}
          onChange={onChange}
        />

        <span className="icon is-small is-left">
          <i className="fas fa-envelope" />
        </span>
      </div>

      {error && (
        <p className="help is-danger">{errorText}</p>
      )}
    </div>
  );
};

export default Input;
