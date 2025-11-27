const baseUrl = 'https://app.xeghepnd.com/';

const AppConfig = {
  BASE_URL: baseUrl,

  Config: {
    link_post_register: baseUrl + 'api/auth/register',
    link_post_login: baseUrl + '/api/auth/login',
    link_post_forgot_password: baseUrl + '',
    link_post_change_Password: baseUrl + 'api/auth/password/change',
    link_get_put_user: baseUrl + 'api/auth/me',
  },
};

export default AppConfig;
