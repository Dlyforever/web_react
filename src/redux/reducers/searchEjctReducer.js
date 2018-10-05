import {handleActions} from 'redux-actions';
import {
  GET_SEARCHEJCT_YUQING_REQUESTED,
  GET_SEARCHEJCT_YUQING_SUCCEEDED,
  GET_SEARCHEJCT_CLASSIFY_REQUESTED,
  GET_SEARCHEJCT_CLASSIFY_SUCCEEDED,
  GET_SEARCHEJCT_SPECIAL_REQUESTED,
  GET_SEARCHEJCT_SPECIAL_SUCCEEDED
} from '../actions/actionTypes'
// 搜索弹出舆情
export const searchRequestRequested = handleActions(
  {
    [GET_SEARCHEJCT_YUQING_REQUESTED]: (state, action) => (
      {data: action.payload}
    ),
    [GET_SEARCHEJCT_CLASSIFY_REQUESTED]: (state, action) => (
      {data: action.payload}
    ),
    [GET_SEARCHEJCT_SPECIAL_REQUESTED]: (state, action) => (
      {data: action.payload}
    )
  }, '1'
)
export const searchRequestSucceeded = handleActions(
  {
    [GET_SEARCHEJCT_YUQING_SUCCEEDED]: (state, action) => (
      {data: {searchList: action.payload}}
    ),
    [GET_SEARCHEJCT_CLASSIFY_SUCCEEDED]: (state, action) => (
      {data: {searchList: action.payload}}
    ),
    [GET_SEARCHEJCT_SPECIAL_SUCCEEDED]: (state, action) => (
      {data: {searchList: action.payload}}
    )
  },{data: {searchList: {docList: [], carryCount: [], pageInfo: 0}}}
)
