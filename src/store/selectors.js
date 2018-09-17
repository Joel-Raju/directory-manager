import { createSelector } from 'reselect';
import _ from 'lodash';

const getFullDirectoryTree = state => state.directoryTree;

const getPWD = state => state.pwd;

const getCurrentDirectoryTree = createSelector(getFullDirectoryTree, getPWD, 
  (directoryTree, pwd) => {
    let treeToRender = _.cloneDeep(directoryTree);
    let path = pwd.slice().toString();
    path = path.split(',').join('.children.');
    return { [pwd.slice(pwd.length - 1)]:  _.get(treeToRender, path) };
  });

const isAtRoot = createSelector(getPWD,
  (pwd) => (pwd.length === 1 && pwd[0] === '/'));

const pwdDisplayText = createSelector(getPWD, 
  (pwd) => {
    return pwd[0] + pwd.slice(1).toString().split(',').join(' / ');
  });

const getDirNamesAtCurrentPath = createSelector(getFullDirectoryTree, getPWD, 
  (directoryTree, pwd) => {
    let treeToRender = _.cloneDeep(directoryTree);
    let path = pwd.slice().toString();
    path = path.split(',').join('.children.');
    let { children } = _.get(treeToRender, path);
    return Object.keys(children);
  });

export {
  getCurrentDirectoryTree,
  isAtRoot,
  pwdDisplayText,
  getDirNamesAtCurrentPath,
};