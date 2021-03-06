import { useFormBloc } from '@src/blocs/form';
import { UserEvents, UserPrivileges, useUserBloc } from '@src/blocs/user';
import { Form, FormField } from '@src/components/form';
import { MainTemplate } from '@src/components/templates/main-template';
import { useConnection } from '@src/config/configure-connection-utils';
import { endpoints, routes } from '@src/config/routes';
import { createUseStyle } from '@src/config/theme';
import React from 'react';
import { useHistory } from 'react-router-dom';

export function LoginScreen() {
  const { styles } = useStyle();
  const history = useHistory();
  const userBloc = useUserBloc();
  const { create } = useConnection();
  const formBloc = useFormBloc(
    'login',
    {
      email: '',
      password: '',
    },
    {
      onSubmit: async (data) => {
        return create(endpoints.auth, data);
      },
      onSuccess: (jwt: string) => {
        userBloc.dispatch(new UserEvents.Change(jwt));
        history.push(routes.home);
      },
    }
  );

  return (
    <MainTemplate
      style={styles.container}
      title='Log In'
      showBackArrow={true}
      actions={[
        userBloc.isAuthorized(UserPrivileges.seeRegistration)
          ? {
              label: 'Register',
              onClick: () => {
                history.push(routes.register);
              },
            }
          : undefined,
      ]}
    >
      <Form.Wrapper style={styles.form} formBloc={formBloc}>
        <Form.Builder
          formBloc={formBloc}
          builder={(data, createFormFieldProps) => {
            return (
              <React.Fragment>
                <FormField.Text
                  {...createFormFieldProps('email')}
                  label='E-mail'
                />
                <FormField.Text
                  {...createFormFieldProps('password')}
                  label='Password'
                  obscure={true}
                />
              </React.Fragment>
            );
          }}
        />
      </Form.Wrapper>
    </MainTemplate>
  );
}

const useStyle = createUseStyle(({ theme, dimensions, shared }) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },

  form: {
    maxWidth: 500,
  },
}));
