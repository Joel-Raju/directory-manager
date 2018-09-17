import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import DirectoryManager from './components/DirectoryManager';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <DirectoryManager />
      </Provider>
    );
  }
}

export default App;
