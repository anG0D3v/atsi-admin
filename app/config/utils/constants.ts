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
  RESTORE: 'restore',
  MULTIDELETE: 'multiDelete',
  IMGDELETE: 'imgDelete'
};

const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Deleted',
  AVAILABLE: 'Available',
  UNAVAILABLE: 'isDeleted',
  OUT_OF_STOCK: 'Out_of_Stock',
  NEW_RELEASE: 'isNewRelease',
  SALE_PRODUCT:'isSaleProduct'
};

const QUILL_FORMATS = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
];

const QUILL_MODULES = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

export {
  ACTIONS,
  API_VERSION,
  MESSAGES,
  QUILL_FORMATS,
  QUILL_MODULES,
  STATUS,
  STATUS_CODES,
};
