import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';
import Node from './Node';
import Modal from './Modal';
import { 
  createDirectory,
  pushToPWD,
  popFromPWD,
} from '../store/actions/fileSystemActions';
import {
  getCurrentDirectoryTree,
  isAtRoot,
  pwdDisplayText,
  getDirNamesAtCurrentPath,
} from '../store/selectors';


const ModalErrorMessage = styled.div`
  color: red;
  font-weight: bolder;
  font-size: 1rem;
`;

class DirectoryManager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalState: false,
      directoryName: '',
    };
    
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.onDirectoryNameChange = this.onDirectoryNameChange.bind(this);
    this.createDirectory = this.createDirectory.bind(this);
    this.goBack = this.goBack.bind(this);
    this.setPresentWorkingDirectory = this.setPresentWorkingDirectory.bind(this);
  }

  setPresentWorkingDirectory(dirName, e) {
    e.stopPropagation();
    const { pushToPWD, pwd } = this.props;
    pushToPWD(dirName, pwd);
  }

  goBack() {
    this.props.popFromPWD();
  }


  createDirectory() {
    const { directoryName } = this.state;
    const { pwd } = this.props;
    this.props.createDirectory(directoryName, pwd);
    this.closeModal();
  }

  showModal() {
    this.setState({ modalState: true });
  }

  closeModal() {
    this.setState({modalState: false , directoryName: ''});
  }

  onDirectoryNameChange(event) {
    this.setState({ directoryName: event.target.value });
  }

  render() {
    const { directory, pwdDisplayText, isAtRoot } = this.props;
    const { modalState, directoryName } = this.state;

    return(
      <div className="container">
        <div>Directory Manager</div>
        <div className="columns">
          <div className="column is-three-fifths">You are here: {pwdDisplayText}</div>
          <div className="buttons column">
            <span className="button" onClick={this.showModal}>
              <FiPlusCircle />
              Create Directory
            </span>
            { !isAtRoot ?  this.renderBackBtn() : null }
          </div>
        </div>
        
        { this.renderCurrentDirectoryTree(directory) }
        <Modal 
          closeModal={this.closeModal}
          modalState = {modalState}
          title="Enter directory name"
          successAction={this.createDirectory}
          successActionText="Create"
          successActionDisabled={this.renderErrorMessage() != null}>
          <input
            className="input"
            type="text"
            value={directoryName}
            onChange={this.onDirectoryNameChange} />
          { this.renderErrorMessage() }
        </Modal>  
      </div>
    );
  }

  renderBackBtn() {
    return(
      <span className="button" onClick={this.goBack}>
        <FiArrowLeft />
        back
      </span>
    );
  }

  renderCurrentDirectoryTree(directory) {
    let nodes = Object.keys(directory).map(dirName => {
      return (
        <Node
          key={directory[dirName]._meta.createdTimeStamp}
          name={dirName}
          children={directory[dirName].children}
          meta={directory[dirName]._meta}
          onClick={this.setPresentWorkingDirectory} />
      )
    });

    return nodes;
  }

  renderErrorMessage() {
    const { dirNamesAtCurrentPath } = this.props;
    const { directoryName } = this.state;
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    let isNameAlreadyPresent = false;

    dirNamesAtCurrentPath.forEach(name => {
      if (!isNameAlreadyPresent && name) {
        isNameAlreadyPresent = (name.toLowerCase() === directoryName.toLowerCase());  
      }
    });

    if (isNameAlreadyPresent) {
      return (
        <ModalErrorMessage>uh-oh ! You already have a folder named. "{directoryName}"</ModalErrorMessage>
      );
    }

    if (directoryName.match(regex)) {
      return (
        <ModalErrorMessage>uh-oh ! Special characters are not allowed. "{directoryName}"</ModalErrorMessage>
      ); 
    }

    return null;
  }

}

DirectoryManager.propTypes = {
  createDirectory: PropTypes.func.isRequired,
  pushToPWD: PropTypes.func.isRequired,
  popFromPWD: PropTypes.func.isRequired,
  pwd: PropTypes.array.isRequired,
  directory: PropTypes.object.isRequired,
  isAtRoot: PropTypes.bool.isRequired,
  pwdDisplayText: PropTypes.string.isRequired,
  dirNamesAtCurrentPath: PropTypes.array.isRequired,
};


const mapDispatchToProps = dispatch => bindActionCreators({
  createDirectory,
  pushToPWD,
  popFromPWD,
}, dispatch);

const mapStateToProps = (state) => {
  const { fileSystemReducer } = state;
  const { pwd } = state.fileSystemReducer;
  return { 
    directory: getCurrentDirectoryTree(fileSystemReducer), 
    pwd,
    isAtRoot: isAtRoot(fileSystemReducer),
    pwdDisplayText: pwdDisplayText(fileSystemReducer),
    dirNamesAtCurrentPath: getDirNamesAtCurrentPath(fileSystemReducer),
  };
};

export default
compose(connect(mapStateToProps, mapDispatchToProps))(DirectoryManager);