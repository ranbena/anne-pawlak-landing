import React from 'react';
import {
  useShortAnswerInput,
  useGoogleForm,
  GoogleFormProvider,
} from 'react-google-forms-hooks';
import { Form as AntForm, Button } from 'antd';
import formData from '../data/GoogleForm.json';
import { CheckOutlined, SendOutlined } from '@ant-design/icons';
import './Form.css';

const errorMessages: Record<string, string> = {
  required: 'Please fill out both fields',
  pattern: 'Email address invalid',
};

type IFormInputs = {
  id: string;
  type?: 'email' | 'text';
  placeholder: string;
  disabled?: boolean;
};

const ShortAnswerInput = ({
  id,
  type = 'text',
  placeholder,
  disabled,
}: IFormInputs) => {
  const { register } = useShortAnswerInput(id);

  return (
    <AntForm.Item className="antFormItem">
      <input
        placeholder={placeholder}
        type="text"
        disabled={disabled}
        autoComplete="off"
        {...register({
          required: true,
          pattern:
            type === 'email'
              ? /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
              : undefined,
        })}
      />
    </AntForm.Item>
  );
};

const Form = () => {
  // @ts-ignore
  const methods = useGoogleForm({ form: formData });
  const { formState } = methods;
  const success = formState.isSubmitSuccessful;

  const onSubmit = React.useCallback(
    async (data: any) => {
      await methods.submitToGoogleForms(data);
    },
    [methods]
  );

  const errorMessage = React.useMemo(() => {
    if (!formState.errors) return undefined;

    const arr = Object.values(formState.errors);
    const type = arr.length ? (arr[0]?.type as string) : undefined;
    if (type) {
      return errorMessages[type];
    }
  }, [formState]);

  return (
    <GoogleFormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={success ? 'success' : undefined}
      >
        <ShortAnswerInput
          id="872857641"
          placeholder="Full name"
          disabled={success}
        />
        <ShortAnswerInput
          id="1215295443"
          type="email"
          placeholder="Email address"
          disabled={success}
        />
        {errorMessage ? <div className="error">{errorMessage}</div> : null}
        <Button
          className="button"
          size="large"
          type="primary"
          htmlType="submit"
          loading={formState.isSubmitting}
          icon={success ? <CheckOutlined /> : <SendOutlined />}
        >
          {success ? 'Sent!' : 'Send me the PDF'}
        </Button>
      </form>
    </GoogleFormProvider>
  );
};

export { Form };
