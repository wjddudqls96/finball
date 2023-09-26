import React, { useEffect, useState } from "react";
import { Engine, Render, World, Bodies, Body,Runner } from "matter-js";
import styles from "./Pinball.module.css";
import test from "../../assets/defalutball.png";
import { StyleRounded } from "@mui/icons-material";

function Pinball(value) {
  const [engine, setEngine] = useState(null);
  const [render, setRender] = useState(null);
  const [balls, setBalls] = useState([]);
  const [ballcnt, setBallcnt] = useState(40);
  console.log(test)
  // 부모 컨테이너의 크기를 가져오는 함수
  const getParentContainerSize = () => {
    const parentContainer = document.getElementById(value.value.parent); // 부모 컨테이너의 ID로 가져옴
    return {
      width: parentContainer.clientWidth,
      height: parentContainer.clientHeight,
    };
  };

  useEffect(() => {
    // 부모 컨테이너의 크기를 가져옴
    const parentSize = getParentContainerSize();
    // Create a Matter.js engine
    const newEngine = Engine.create({});
    const runner = Runner.create({
      delta: 1000 / 60,
      isFixed: false,
      enabled: true
  });
    setEngine(newEngine);

    // 중력 설정
    newEngine.world.gravity.x = 0;
    newEngine.world.gravity.y = 0.6;

    // Create a renderer
    const newRender = Render.create({
      element: document.getElementById(value.value.parent), // 렌더러를 부모 컨테이너에 적용
      engine: newEngine,
      options: {
        width: parentSize.width, // 부모 컨테이너의 가로 크기로 설정
        height: parentSize.height, // 부모 컨테이너의 세로 크기로 설정
        wireframes: false,
        background: "white",
      },
    });
    setRender(newRender);

    // Create ground
    const ground = Bodies.rectangle(
      parentSize.width / 2,
      parentSize.height,
      parentSize.width * 2,
      parentSize.width * 0.01,
      {
        isStatic: true,
        render: {
          // fillStyle: "#4C4499",
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }
    );
    const wall1 = Bodies.rectangle(
      parentSize.width,
      parentSize.height,
      parentSize.width * 0.01,
      parentSize.height * 2,
      {
        isStatic: true,
        render: {
          // fillStyle: "#4C4499",
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }
    );
    const wall2 = Bodies.rectangle(
      0,
      0,
      parentSize.width * 0.01,
      parentSize.height * 2,
      {
        isStatic: true,
        render: {
          // fillStyle: "#4C4499",
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }
    );
    const wall3 = Bodies.rectangle(
      0,
      0,
      parentSize.width * 2,
      parentSize.width * 0.01,
      {
        isStatic: true,
        render: {
          // fillStyle: "#4C4499",
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      }
    );
      
    // Create balls array
    for (let i = 0; i < ballcnt; i++) {
      const ball = Bodies.circle(
        Math.random() * parentSize.width,
        Math.random() * parentSize.height/5,
        Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23,
        {
          density: 0.5,
          frictionAir: 0.06,
          restitution: 0.3,
          friction: 0.01,
          isStatic: false,
          isSensor:false,
          render: {
            fillStyle: "#05CD01",
            strokeStyle: "white",
            lineWidth: 3,
            sprite: {
              //''히먄 스프라이트 적용x
              texture: test,
              xScale: Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23/30,
              yScale: Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23/30,
            },
          },
        }
      );
      balls.push(ball);
    }
    const clickEvent = (function () {
      if ("ontouchstart" in document.documentElement === true) {
        return "touchstart";
      } else {
        return "click";
      }
    })();
    newRender.canvas.addEventListener(clickEvent, () => {
      const exitVelocity = 12;
      const sortedBalls = [...balls].sort(
        (a, b) => b.position.y - a.position.y
      );
    
      // 각 공을 삭제하면서 새로운 배열에 추가
      const ball = [];
      const dir = [1, -1];
      for (let i = 1; i < 11; i++) {
        const removedBall = balls.pop();
        removedBall.isSensor = true;
        Body.setVelocity(removedBall, { x: exitVelocity * dir[i % 2], y: 0 });
        ball.push(removedBall);
      }
    
      function update() {
        // 각 공의 위치를 조정
        ball.forEach(b => {
          b.position.y += exitVelocity / 60; // 1초에 60프레임으로 가정
          // 화면 밖으로 벗어난 공을 삭제
          if ((b.position.y > parentSize.height + Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23)||(b.position.x > parentSize.width + Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23)||(b.position.x < -Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23)) {
            // Matter.js World에서 삭제
            World.remove(newEngine.world, b);
            ball.splice(ball.indexOf(b), 1);
          }
        });
    
        // 화면 갱신
        Render.world(newRender);
        requestAnimationFrame(update);
      }
    
      // update 함수를 호출하여 화면을 갱신
      update();
      setBallcnt(sortedBalls.length);
    });
    
    const fadeOutBodies = (bodies) => {
      const fadeOutInterval = setInterval(() => {
        bodies.forEach((body) => {
          if (body.render.opacity > 0) {
            body.render.opacity -= 0.05; // 원하는 페이드 아웃 속도 조절
            if (body.render.opacity <= 0) {
              World.remove(newEngine.world, body);
              clearInterval(fadeOutInterval);
            }
          }
        });
      }, 50); // 50ms마다 투명도 조절
    };
    newRender.canvas.addEventListener(clickEvent, () => {
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          const ball = Bodies.circle(
            Math.random() * parentSize.width,
            parentSize.height / 10,
            Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23,
            {
              density: 0.0005,
              frictionAir: 0.06,
              restitution: 0.3,
              friction: 0.01, 
              isStatic: false,
              isSensor:false,
              render: {
                fillStyle: "#05CD01",
                strokeStyle: "white",
                lineWidth: 3,
                sprite: {
                  //''하면 스프라이트 적용x
                  texture: test,
                  xScale: Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23/30,
                  yScale: Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23/30,
                },
              },
            }
          );
          balls.push(ball);
          World.add(newEngine.world, ball);
        }
      }, 1000);
    });
    const Boundary = [ground, wall1, wall2, wall3];
    World.add(newEngine.world, [...Boundary, ...balls]);

    // Run the engine and renderer
    Runner.run(runner, newEngine);
    Render.run(newRender);

    // 윈도우 크기가 변경될 때 렌더러 크기를 업데이트
    window.addEventListener("resize", () => {
      const newSize = getParentContainerSize();
      Render.canvasSize(newRender, newSize.width, newSize.height);
      // 물리 엔진에서도 크기 업데이트 필요
      Bounds.update(newRender.bounds, newSize);
    });

    return () => {
      // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div id="pinball-canvas">
      {value.value.cost?
      <div style={{ display: "flex",justifyContent: "flex-end",transform:"translate(0,100%)"}}>
      <div className={styles.finball}>
        {value.value.cost}원
      </div>
      </div>:<></>}
    </div>
  );
}

export default Pinball;
