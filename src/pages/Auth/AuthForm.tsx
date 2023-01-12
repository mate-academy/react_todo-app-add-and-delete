import { FC, useState } from 'react';
import classNames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/useRedux';
import Input from '../../components/Controls/Input';
import UsersAsync from '../../store/users/usersAsync';
import { usersActions } from '../../store/users/usersSlice';
import { authActions } from '../../store/auth/authSlice';
import {
  isEmailValid, isFieldRequired, isMinValue,
} from '../../utilities/Validation';

interface Form {
  email: string;
  name: string;
}

const AuthForm:FC = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [needToRegister, setNeedToRegister] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const checkUser = (email: string) => {
    setLoading(true);
    dispatch(UsersAsync.fetchUser(email))
      .unwrap()
      .then((user) => {
        if (user) {
          dispatch(usersActions.setCurrentUser(user));
          dispatch(authActions.setAuthenticated(true));
        } else {
          setNeedToRegister(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const createUser = (data: Form) => {
    setLoading(true);
    dispatch(UsersAsync.createUser(data))
      .unwrap()
      .then(() => {
        dispatch(authActions.setAuthenticated(true));
      })
      .finally(() => setLoading(false));
  };

  const onSubmit = handleSubmit((data: Form) => {
    if (needToRegister) {
      createUser(data);
    } else {
      checkUser(data.email);
    }
  });

  return (
    <form onSubmit={onSubmit} className="box mt-5" noValidate>
      <h1 className="title is-3">
        {needToRegister ? 'You need to register' : 'Log in to open todos'}
      </h1>

      <Controller
        control={control}
        name="email"
        rules={{ required: isFieldRequired, pattern: isEmailValid }}
        render={({ field: { value, onChange } }) => (
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            disabled={loading || needToRegister}
            value={value}
            onChange={onChange}
            required
            error={!!errors.email}
            errorText={errors.email?.message || ''}
          />
        )}
      />

      {needToRegister && (
        <Controller
          control={control}
          name="name"
          rules={{
            required: isFieldRequired,
            validate: {
              isMinValue: (value) => isMinValue(value, 4),
            },
          }}
          render={({ field: { value, onChange } }) => (
            <Input
              label="Your Name"
              placeholder="Enter your name"
              value={value}
              onChange={onChange}
              required
              error={!!errors.name}
              errorText={errors.name?.message || ''}
            />
          )}
        />
      )}

      <div className="field is-flex" style={{ gap: '12px' }}>
        <button
          type="submit"
          className={classNames('button is-primary', {
            'is-loading': loading,
          })}
        >
          {needToRegister ? 'Register' : 'Login'}
        </button>
        {needToRegister && (
          <button
            type="button"
            className="button is-secondary"
            onClick={() => setNeedToRegister(false)}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
