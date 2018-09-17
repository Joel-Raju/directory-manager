import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import { FiFolder } from 'react-icons/fi';

const Node = ({name, children, onClick, className}) => {
  return(
    <Fragment>
      <div onClick={(event) => onClick(name, event)} className={className}>
        <FiFolder />
        <span>{name}</span>
        { !_.isEmpty(children) ?  renderChildren(children, onClick) : null }
      </div>
    </Fragment>
  );
};

const renderChildren = (children, onClick) => {
  let childNodes = Object.keys(children).map(dirName => {
    return (
      <StyledNode
        key={children[dirName]._meta.createdTimeStamp}
        name={dirName}
        meta={children[dirName]._meta}
        onClick={onClick}
      />
    );
  });

  return childNodes;
};

const StyledNode = styled(Node)`
  margin-left: 16px;

  span {
    margin-left: 8px;
  }
`;


Node.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.object,
};

export default StyledNode;