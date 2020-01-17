import http from 'utils/httpInstance';

// action
export const CLEAR_BUG_DATA = 'singlebug/CLEAR_BUG_DATA';
export const FETCH_BUG_REQUEST = 'singlebug/FETCH_BUG_REQUEST';
export const FETCH_BUG_SUCCESS = 'singlebug/FETCH_BUG_SUCCESS';
export const FETCH_BUG_FAILURE = 'singlebug/FETCH_BUG_FAILURE';

export const ADD_COMMENT_REQUEST = 'singlebug/ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'singlebug/ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'singlebug/ADD_COMMENT_FAILURE';

export const TOGGLE_BUG_REQUEST = 'singlebug/TOGGLE_BUG_REQUEST';
export const TOGGLE_BUG_SUCCESS = 'singlebug/TOGGLE_BUG_SUCCESS';
export const TOGGLE_BUG_FAILURE = 'singlebug/TOGGLE_BUG_FAILURE';

export const EDIT_LABELS_REQUEST = 'singlebug/EDIT_LABELS_REQUEST';
export const EDIT_LABELS_SUCCESS = 'singlebug/EDIT_LABELS_SUCCESS';
export const EDIT_LABELS_FAILURE = 'singlebug/EDIT_LABELS_FAILURE';

export const EDIT_COMMENT_REQUEST = 'singlebug/EDIT_COMMENT_REQUEST';
export const EDIT_COMMENT_SUCCESS = 'singlebug/EDIT_COMMENT_SUCCESS';
export const EDIT_COMMENT_FAILURE = 'singlebug/EDIT_COMMENT_FAILURE';

export const UPDATE_BUG_REQUEST = 'singlebug/UPDATE_BUG_REQUEST';
export const UPDATE_BUG_SUCCESS = 'singlebug/UPDATE_BUG_SUCCESS';
export const UPDATE_BUG_FAILURE = 'singlebug/UPDATE_BUG_FAILURE';

export const UPDATE_LABEL_CHECKBOX = 'singlebug/UPDATE_LABEL_CHECKBOX';
export const CLEAR_LABEL_CHECKBOX = 'singlebug/CLEAR_LABEL_CHECKBOX';


interface DefaultStateProps {
  bug: any,
  labelsCheckbox: string[]
}

const DEFAULT_STATE: DefaultStateProps = {
  bug: null,
  labelsCheckbox: []
}

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case FETCH_BUG_SUCCESS:
      return { ...state, bug: action.payload }
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          comments: action.payload
        }
      }
    case TOGGLE_BUG_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          activities: action.payload,
          isOpen: action.bug_state === 'open' ? true : false
        }
      }
    case UPDATE_LABEL_CHECKBOX:
      return {
        ...state,
        labelsCheckbox: [...action.payload]
      }
    case CLEAR_LABEL_CHECKBOX:
      return {
        ...state,
        labelsCheckbox: []
      }
    case EDIT_LABELS_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          labels: action.payload
        }
      }
    case EDIT_COMMENT_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          comments: action.payload
        }
      }
    case UPDATE_BUG_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          body: action.payload.body
        }
      }
    case CLEAR_BUG_DATA:
      return { ...state, bug: null }
    default:
      return state;
  }
}

export default reducer;

// action creators
const errorAction = (action: string, payload: any) => ({
  type: action, payload: payload || 'Something went wrong'
});

export const updateLabelCheckbox = (data: string[]) => {
  return { type: UPDATE_LABEL_CHECKBOX, payload: data }
}

// side effects
export const fetchBugWithId = (bugId: number | string) => {
  return async (dispatch: any) => {
    dispatch({ type: CLEAR_BUG_DATA });
    dispatch({ type: FETCH_BUG_REQUEST });
    try {
      const res = await http({
        method: 'GET',
        url: `/api/bugs/${bugId}`,
      });
      let { data } = res.data;
      dispatch({ type: FETCH_BUG_SUCCESS, payload: data });
    } catch (err) {
      dispatch(errorAction(FETCH_BUG_FAILURE, err?.response?.data?.error))
    }
  }
}

export const addComment = (bugId: number | string, formData: { body: string }) => {
  return async (dispatch: any) => {
    dispatch({ type: ADD_COMMENT_REQUEST });
    try {
      const res = await http.patch(`/api/bugs/${bugId}/comments`, formData);
      let { data } = res.data;
      dispatch({
        type: ADD_COMMENT_SUCCESS,
        payload: data
      });
    } catch (err) {
      dispatch(errorAction(ADD_COMMENT_FAILURE, err?.response?.data?.error))
    }
  }
}

export const editComment = (bugId: number | string, commentId: string, formData: { body: string }) => {
  return async (dispatch: any) => {
    dispatch({ type: EDIT_COMMENT_REQUEST });
    try {
      const res = await http.patch(`/api/bugs/${bugId}/comments/${commentId}`, formData);
      let { data } = res.data;
      dispatch({
        type: EDIT_COMMENT_SUCCESS,
        payload: data
      });
    } catch (err) {
      dispatch(errorAction(EDIT_COMMENT_FAILURE, err?.response?.data?.error))
    }
  }
}

export const updateBug = (bugId: number | string, formData: { body: string }) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_BUG_REQUEST });
    try {
      const res = await http.patch(`/api/bugs/${bugId}`, formData);
      let { data } = res.data;
      dispatch({
        type: UPDATE_BUG_SUCCESS,
        payload: data
      });
    } catch (err) {
      dispatch(errorAction(UPDATE_BUG_FAILURE, err?.response?.data?.error))
    }
  }
}

export const openOrCloseBug = (bugId: number | string, state: string) => {
  return async (dispatch: any) => {
    dispatch({ type: TOGGLE_BUG_REQUEST });
    try {
      const res = await http.patch(`/api/bugs/${bugId}/${state}`);
      let { data } = res.data;
      dispatch({
        type: TOGGLE_BUG_SUCCESS,
        payload: data,
        bug_state: state
      });
    } catch (err) {
      dispatch(errorAction(TOGGLE_BUG_FAILURE, err?.response?.data?.error))
    }
  }
}

export const editLabels = (bugId: number | string, labelData: string[]) => {
  return async (dispatch: any) => {
    dispatch({ type: EDIT_LABELS_REQUEST });
    try {
      const res = await http({
        method: 'PATCH',
        url: `/api/bugs/${bugId}/labels`,
        data: { labels: labelData }
      });
      let { data } = res.data;
      dispatch({
        type: EDIT_LABELS_SUCCESS,
        payload: data,
      });
      dispatch({ type: CLEAR_LABEL_CHECKBOX })
    } catch (err) {
      dispatch({ type: CLEAR_LABEL_CHECKBOX })
      dispatch(errorAction(EDIT_LABELS_FAILURE, err?.response?.data?.error))
    }
  }
}