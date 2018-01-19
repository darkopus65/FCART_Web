import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import './App.css';
import NodeComponent from './NodeComponent';

import { DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes'


import PropTypes from 'prop-types';
import graphStore, {GraphStore, Node} from './Stores/GraphStore'


const dropTarget = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        console.log(item);
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);

        graphStore.setNodePosition(item.node_id, left, top);
    },
};



class Graph extends Component {

    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
    };

    constructor(){
        super();
        this.state = {};
        this.rect = null;

    }

    componentDidMount(){
        graphStore.on(GraphStore.EVENT_LOAD, () => {
            this.setState({
                ids: graphStore.getNodeIDs()
            })
        });
        graphStore.parseJSON();

        this.width = graphStore.max * 60 - 40;
        this.height = (graphStore.depth+1) * 90 - 40;


    }
    render(){
        const {connectDropTarget} = this.props;
        if ('ids' in this.state) {

            let style = {
                width: this.width+'px',
                height: this.height+'px'
            };
            const nodes = this.state.ids.map(id => <NodeComponent parentRect = {this.rect} node_id={id} key={id}/>);
            return connectDropTarget(
                <div className="fieldWrapper">
                    <div className="Graph" style={style}>{nodes}</div>
                </div>
            );
        } else return <div></div>
    }
}

export default DragDropContext(HTML5Backend)(
DropTarget(ItemTypes.NODE, dropTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(Graph))