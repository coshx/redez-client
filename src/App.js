import React, { Component } from 'react';
import logo from './logo.svg';
import './styles/App.css';
import './styles/TreeViewer.css';

import ApolloClient from 'apollo-boost'
import { ApolloProvider, Query } from "react-apollo";

import gql from 'graphql-tag';
import Collapsible from 'react-collapsible';

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

const renderComponentTrees = trees => {
  if (!trees) return;
  return trees.map(({ path, name, children }) => (
    <div key={path}>
      <Collapsible
        trigger={<div className={"TreeViewer-collapsible-trigger"}>
                   <span>{name}</span>
                   <span>
                     <div className="TreeViewer-collapsible-trigger-icon">
                     </div>
                   </span>
                 </div>}
        transitionTime={200}
        className="TreeViewer-collapsible"
        openedClassName="TreeViewer-collapsible"
        contentInnerClassName="TreeViewer-collapsible-content"
      >
        <div className='TreeViewer-children'>
          {renderComponentTrees(children)}
        </div>
      </Collapsible>
    </div>
  ))
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <div className="TreeViewer">
            <Query query={gql`
              {
                generateComponentTrees {
                  data
                }
              }
            `}>
              {({ loading, error, data }) => {
                if (loading) return <p>Generating component tree...</p>
                if (error) {
                  console.error(error);
                  return <p>An error occurred when generating the component tree.</p>
                }

                return renderComponentTrees(data.generateComponentTrees.map(tree => JSON.parse(tree.data)));
              }}
            </Query>
          </div>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
