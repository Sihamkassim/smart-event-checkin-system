import { message } from 'ant-design-vue';

export function useToast() {
  const success = (msg) => {
    message.success(msg);
  };

  const error = (msg) => {
    message.error(msg);
  };

  const warning = (msg) => {
    message.warning(msg);
  };

  const info = (msg) => {
    message.info(msg);
  };

  const loading = (msg, duration) => {
    return message.loading(msg, duration);
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
  };
}
