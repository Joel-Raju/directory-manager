import _ from 'lodash';
import { 
  CREATE_DIRECTORY,
  PUSH_TO_PWD,
  POP_FROM_PWD,
} from '../actionTypes';

const INITIAL_STATE = {
  directoryTree: {
    '/': {
          children: {},
          _meta: {
            path: ['/'],
            createdTimeStamp: Date.now(),
            isRoot: true,
          }
        },
  },
  pwd: ['/']
};


const getUpdatedDirectoryTree = (oldDirTree, directoryToAdd, pwd) => {
  let newTree = _.cloneDeep(oldDirTree);
  if (pwd.length === 1 && pwd[0] === '/') {
    newTree['/'].children = { ...newTree['/'].children, ...directoryToAdd };
    return newTree;
  }

  let path = pwd.slice(0).toString();
  path = path.split(',').join('.children.');
  let parentDir = _.get(newTree, path);
  parentDir.children = { ...parentDir.children, ...directoryToAdd };

  return newTree;
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case CREATE_DIRECTORY:
      return { 
        ...state, 
        directoryTree: getUpdatedDirectoryTree(state.directoryTree, action.payload, state.pwd),
      };

    case PUSH_TO_PWD:
      return {
        ...state,
        pwd: [...state.pwd, action.payload],
      };

    case POP_FROM_PWD:
      return {
        ...state,
        pwd: [...state.pwd.slice(0, state.pwd.length - 1)],
      };

    default: 
      return state;
  }
}