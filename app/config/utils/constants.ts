const API_VERSION = {
  V1: 'v1',
};

const STATUS_CODES = {
  OK: 200,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

const MESSAGES = {
  PLEASE_WAIT: 'Please wait',
  LOGGING_IN: 'Logging In...',
  EXECUTING_TASK:
    'The task is being executed. Please wait until it is completed',
  SUCCESS: 'Success.',
  ERROR: 'Something went wrong!',
  UPDATE: 'Your record has been updated.',
  ADDED: 'A new record has been added.',
  DELETED: 'Your record has beed deleted.',
  LOGGED_IN: 'Welcome aboard admin!',
  RESTORED: 'Your data is successfully restored.',
};

const ACTIONS = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
};

const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export { ACTIONS, API_VERSION, MESSAGES, STATUS, STATUS_CODES };
