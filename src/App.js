import React, { Component } from 'react';
import logo from './logo.svg';
import appStyle from './styles/App.module.scss';
import treeStyle from './styles/treeViewer.module.scss';

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
        trigger={<div className={treeStyle['collapsible-trigger']}>
                   <span>{name}</span>
                   <span>
                     <div className={treeStyle['collapsible-trigger-icon']}>
                     </div>
                   </span>
                 </div>}
        transitionTime={200}
        className={treeStyle['collapsible']}
        openedClassName={treeStyle['collapsible']}
        contentInnerClassName={treeStyle['collapsible-content']}
      >
        <div className={treeStyle['children']}>
          {renderComponentTrees(children)}
        </div>
      </Collapsible>
    </div>
  ))
}

class App extends Component {
  render() {
    return (
      <div className={appStyle["App"]}>
        <ApolloProvider client={client}>
          <div className={treeStyle['treeViewer']}>
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
