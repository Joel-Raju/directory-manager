import _ from 'lodash';
import { 
  CREATE_DIRECTORY,
  PUSH_TO_PWD,
  POP_FROM_PWD,
} from '../actionTypes';


const DIRECTORY_TEMPLATE = {
  children: {},
  _meta: {
    createdTimeStamp: '',
    isExpanded: false,
    path: '',
  }
};

const createDirectory = (dirName, pwd) => {
  let directory = _.cloneDeep(DIRECTORY_TEMPLATE);
  directory._meta.createdTimeStamp = Date.now();
  directory._meta.path = pwd.slice();
  directory._meta.path.push(dirName);
  return {
    type: CREATE_DIRECTORY,
    payload: { [dirName]: directory },
  };
};

const pushToPWD = (dirName, pwd) => {
  let currentDirectory = pwd.slice(pwd.length - 1)[0];
  if (currentDirectory === dirName) {
    return {
      type: null,
    };
  }

  return {
    type: PUSH_TO_PWD,
    payload: dirName,
  };
}

const popFromPWD = () => {
  return { type: POP_FROM_PWD };
}

export {
  createDirectory,
  pushToPWD,
  popFromPWD
};
