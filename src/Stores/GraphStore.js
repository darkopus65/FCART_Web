import { EventEmitter} from "events";

export class Node  extends  EventEmitter{
    static EVENT_UPDATE = "update";

    constructor(id, extent, intent) {
        super();
        this.id = id;
        this.attr = {
            extents: extent,
            intent: intent
        };
        this.level = -1;
        this.children = [];
        this.position = null;
        this.levelPosition = null;
    }
    //addChild
    setChildren(child){
        this.children.push(child);
    }
    getChildren(i){
        return this.children[i];
    }
    setPosition(x, y){
        this.position = {
            x: x,
            y: y
        };
        this.emit(Node.EVENT_UPDATE);
    }
    getPosition() {
        return this.position;
    }
}


export class GraphStore extends EventEmitter{

    static EVENT_LOAD = 'load';

    constructor(){
        super();
        this.nodes = {};
        this.depth = 0;
        this.width = {};
        this.max = 0;
    }

    parseJSON(){
        let request = new XMLHttpRequest();
        request.open('GET', "http://localhost:3000/p.json", false);
        request.send(null);
        let jsObg = JSON.parse(request.responseText);
        this.CreateNodes();
        this.WriteChildren("0", "1");
        this.WriteChildren("0", "2");
        this.WriteChildren("0", "3");
        this.WriteChildren("1", "4");
        this.WriteChildren("1", "5");
        this.WriteChildren("2", "6");
        this.WriteChildren("2", "4");
        this.WriteChildren("3", "5");
        this.WriteChildren("3", "7");
        this.WriteChildren("4", "8");
        this.WriteChildren("5", "8");
        this.WriteChildren("6", "7");
        this.WriteChildren("7", "8");
        this.topoSort();
        this.emit(GraphStore.EVENT_LOAD);
    }

    CreateNodes(){
        for(let id = 0; id < 9; id++){
            //id из JSON
            this.nodes[id] = new Node(id, "1,2,3", "1,2,3");
        }
    }

    WriteChildren(parent, child) {
        //addChild
        this.nodes[parent].setChildren(this.nodes[child]);
    }

    topoSort() {
        var Q = [];
        var levelcount = 0;
        Q.push(this.nodes["0"]); // TODO: add root node not being with id 0
        Q[0].level = 0;
        while (Q.length > 0) {
            var curel = Q[0];
            Q = Q.slice(1);
            for (var i = 0; i < curel.children.length; i++) {

                var el = curel.children[i];

                if (el.level !== curel.level + 1) {
                    el.level = curel.level + 1;
                    if (el.level > levelcount) {
                        levelcount = el.level;
                    }
                    Q.push(el);
                }
            }
        }

        this.depth = levelcount;
        for (let id in this.nodes) {
            let level = this.nodes[id].level;
            if (level in this.width) this.width[level]++;
            else this.width[level] = 1;
            this.nodes[id].levelPosition = this.width[level];
            if(this.max < this.getWidth(this.nodes[id].level)) this.max = this.getWidth(this.nodes[id].level);
        }
    }

    getNodes(){
        let result = [];
        for(let id in this.nodes){
            result.push(this.nodes[id]);
        }
        return result;
    }

    setNodePosition(id, x, y){
        this.nodes[id].setPosition(x,y); // TODO: MB graphStore event?
    }

    getNodeIDs(){
        let result = [];
        for(let id in this.nodes){
            result.push(id);
        }
        return result;
    }

    getDepth() {
        return this.depth;
    }

    getWidth(level) {
        return this.width[level];
    }


}

const graph = new GraphStore();
window.GraphStore = graph;

export default graph;