import {INFORMS_STATE} from '../actions/actionTypes';
import {getInformTime} from '../../utils/localStorage';

const isShowTime = (state = getInformTime('isShowTime'), action) => {
    switch (action.type) {
        case INFORMS_STATE:
            return action.payload;
        default:
            return state;
    }
};

export default isShowTime;