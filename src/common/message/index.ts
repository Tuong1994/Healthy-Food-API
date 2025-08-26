const responseMessage = {
  CREATE_SUCCESS: 'Created success',
  CREATE_ERROR: 'Created error',
  UPDATE_SUCCESS: 'Updated success',
  UPDATE_ERROR: 'Updated error',
  REMOVE_SUCCESS: 'Removed success',
  REMOVE_ERRROR: 'Removed error',
  RESTORE_SUCCESS: 'Restored success',
  RESTORE_ERROR: 'Restored error',
  NOT_FOUND: 'Record not found',
  NO_FILE: 'No files were uploaded',
  NO_ID: 'No id was provided',
  NO_DATA_RESTORE: 'There are no data to restore',
  SERVER_ERROR: 'Something wrong',
} as const;

export default responseMessage;