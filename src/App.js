import React, { useEffect, useState } from "react";
import ReactFlow, { ReactFlowProvider } from "react-flow-renderer";
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink,
  forceX,
  forceY,
} from "d3-force";

const elements = [
  { id: "1", data: { label: "Node 1" } },
  // you can also pass a React component as a label
  {
    id: "2",
    data: { label: <div>Node 2</div> },
  },
  { id: "3", data: { label: "Node 3" } },
  { id: "4", data: { label: "Node 4" } },
  { id: "5", data: { label: "Node 5" } },
  { id: "6", data: { label: "Node 6" } },
  { id: "7", data: { label: "Node 7" } },
];
const edges = [
  { id: "e1", source: "1", target: "2", animated: true },
  { id: "e2", source: "1", target: "3", animated: true },
  { id: "e3", source: "1", target: "4", animated: true },
  { id: "e4", source: "2", target: "5", animated: true },
  { id: "e5", source: "3", target: "6", animated: true },
  { id: "e6", source: "1", target: "7", animated: true },
];

function App() {
  const [nodes, setNodes] = useState(elements);
  const [links, setLinks] = useState(edges);

  const simulation = forceSimulation(elements)
  .force(
    "charge",
    forceManyBody().strength(2).distanceMax(2000).distanceMin(1)
  )
  .force(
    "link",
    forceLink()
      .links(edges)
      .id((id) => id.id)
      .distance(100)
  )
  .force("center", forceCenter(250, 350))
  .force("collide", forceCollide().radius(150).strength(0.7))
  .force("x", forceX().strength(0.7))
  .force("y", forceY().strength(0.7));
  const layout = () =>{
    // update state on every frame

    simulation.on("tick", () => {
      setNodes([...simulation.nodes()])
    })
  
    // copy nodes into simulation
    simulation.nodes([...nodes])
    // slow down with a small alpha
    simulation.alpha(0.1).restart()
  
  }


  useEffect(() => {
  
    layout();
  
    // stop simulation on unmount
    return () => simulation.stop();
  }, [])

  return (
    <>
      <div
        className="App"
        style={{ width: "1000px", height: "1000px", border: "1px solid gray" }}
      >
        <ReactFlowProvider>
          <ReactFlow
            defaultPosition={[100, 100]}
            maxZoom={20}
            elements={[
              ...nodes.map((n) => {
                return { id: n.id, data: n.data, position: { x: n.x, y: n.y } };
              }),
              ...edges.map((e) => {
                return {
                  id: e.id,
                  source: e.source.id,
                  target: e.target.id,
                };
              }),
            ]}
            onNodeDragStop={(event, node) => {
              layout();
            }}

            // onNodeDragStart={(event,node) => {
            //   simulation.alphaTarget(0.3).restart();
            // }}
            // onNodeDragStop={(event, node) => {
            //   simulation.alphaTarget(0).stop();

            // }}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
}

export default App;
