import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import './App.css';

import PropTypes from 'prop-types';
import ItemTypes from './ItemTypes'
import { DragSource } from 'react-dnd'


import graphStore, {GraphStore, Node} from './Stores/GraphStore'


const nodeSource = {
    beginDrag(props) {
        const { node_id} = props;
        let position = graphStore.nodes[node_id].getPosition();
        let top = position.y;
        let left = position.x;
        return { node_id, left, top };
    },
};


class NodeComponent extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        node_id: PropTypes.any.isRequired
    };


    constructor(props){
        super(props);
        const {node_id, parentRect} = props;
        this.rect = parentRect;
        this.id = node_id;
        this.depth = graphStore.getDepth();
        this.node = graphStore.nodes[this.id];
        this.state = {};

        this.getInitialPosition();
    }

    componentDidMount() {
        this.node.on(Node.EVENT_UPDATE, () => {
            console.log("redraw");
            this.setState({});
        });
    }

    getInitialPosition(){

        this.node.position = {
            y : (this.node.level)*90,
            x : ((graphStore.max * 60 - 40 - 20*(graphStore.width[this.node.level])) / ((1+graphStore.width[this.node.level]))) * (this.node.levelPosition) + 20*(this.node.levelPosition-1)
        };
    }

    render() {
        console.log('rerendering node');
        const {
            hideSourceOnDrag,
            connectDragSource,
            isDragging,
        } = this.props;

        var styles = {
            position: 'absolute',
            top: this.node.position.y+'px',// TODO count with pixels
            left: this.node.position.x+'px'
        };

        if (isDragging) {
            return null
        }

        return connectDragSource(
            <div className="box" style={styles}>
                <div className="text"><div className="t">{this.node.level}</div></div>
                <div className="text"><div className="t">{this.node.level}</div></div>
            </div>
        );
    }
}

export default DragSource(ItemTypes.NODE, nodeSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))(NodeComponent)