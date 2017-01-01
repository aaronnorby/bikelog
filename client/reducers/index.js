import { combineReducers } from 'redux';

import { signup, token } from './auth';
import { maintenance, bike, getUserBike } from './bike';

const rootReducer = combineReducers({
  signup, token, maintenance, bike
});

export default rootReducer;
export { getUserBike };
