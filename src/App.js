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
  const [simulation, _] = useState(
    forceSimulation(elements)
      .force(
        "charge",
        forceManyBody().strength(-50).distanceMax(2000).distanceMin(1)
      )
      .force(
        "link",
        forceLink()
          .links(edges)
          .id((id) => id.id)
          .distance(100)
      )
      .force("center", forceCenter(500, 500))
      .force("collide", forceCollide().radius(150).strength(0.7))
      .force("x", forceX().strength(0.7).x(0.5))
      .force("y", forceY().strength(0.7).y(0.5)).on("tick",()=>{
        console.log("tick");
        console.log(nodes);
      })
  );


  const tick = () => {
    let alpha = simulation.alpha();
    let alphaMin = simulation.alphaMin();
    console.log("alphaMin");
    console.log(alphaMin);
    console.log(alpha);
    console.log(alpha < alphaMin);

    if (alpha < alphaMin) {
      // clearInterval(timerID);
    } else {
      simulation.tick();
      setNodes((prev) =>
        simulation.nodes().map((n) => {
          return { ...n, position: { x: n.x, y: n.y } };
        })
      );
      console.log("heree 2");
    }
  };

  const layout = () => {
    console.log(simulation);

    // simulation.nodes(nodes);
    console.log("heree 1");
    simulation.tick();
    setNodes((prev) =>
      simulation.nodes().map((n) => {
        return { ...n, position: { x: n.x, y: n.y } };
      })
    );

    // simulation.stop();
    // setTimerID(setInterval(() => tick(), 100000))
    // setInterval(() => tick(), 40)
    console.log("simulat");
    console.log(simulation.nodes());
    // console.log(nodes);
  };

  useEffect(() => {
    layout();

    // return () => {
    //   if (timerID) clearInterval(timerID);
    // };
  }, []);

  useEffect(() => {
    console.log("nodes");
    console.log(edges);
  }, [nodes]);
  console.log("final nodes");
    console.log(nodes);
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
            // elements={[...graph.nodes, ...graph.edges]}
            elements={[
              ...nodes.map((n) => {
                return { ...n, position: { x: n.x, y: n.y } };
              }),
              ...edges.map((e) => {
                return {
                  ...e,
                  id: e.id.toString(),
                  source: e.source.id,
                  target: e.target.id,
                };
              }),
            ]}
            onNodeDragStop={(event, node) => layout()}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
}

export default App;
