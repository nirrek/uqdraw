
// TODO: return this as part of the login payload instead.
export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
// export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchUser = (id) => ({
  type: FETCH_USER,
  id,
});

export const fetchUserSuccess = (user) => ({
  type: FETCH_USER_SUCCESS,
  user,
});

// export const fetchUserFailure = (id, error) => ({
//   type: FETCH_USER_FAILURE,
//   id,
//   error,
// });
