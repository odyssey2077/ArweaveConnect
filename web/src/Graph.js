import ForceGraph3D from "react-force-graph-3d";
import React, { useEffect, useRef } from 'react';
import SpriteText from 'three-spritetext';
import * as THREE from "three";


export default function Graph(props) {
  const distance = 150;

  const fgRef = useRef();

  useEffect(() => {
    fgRef.current.cameraPosition({ z: distance });

    // camera orbit
    let angle = 0;
    const interval = setInterval(() => {
      fgRef.current.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle)
      });
      angle += Math.PI / 300;
    }, 60);
    return () => clearInterval(interval);
  }, [props]);

  return (
    <div>
      <ForceGraph3D
          graphData={props.data}
          enableNavigationControls={false}
          showNavInfo={false}
          ref={fgRef}
          nodeId="id"
          linkCurvature={0.1}
          nodeLabel="id"
          nodeAutoColorBy="group"
          nodeRelSize={2}
          linkOpacity={0.4}
          nodeThreeObject={node => {
              // use a sphere as a drag handle
              const obj = new THREE.Mesh(
                  new THREE.SphereGeometry(10),
                  new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
              );
              // add text sprite as child
              const sprite = new SpriteText(node.id);
              sprite.color = node.color;
              sprite.textHeight = 2;
              obj.add(sprite);
              return obj;
          }}
          linkDirectionalArrowLength={.4}
      />
    </div>
  );
}
