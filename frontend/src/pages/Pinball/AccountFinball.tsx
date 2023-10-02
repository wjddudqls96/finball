import React, { useEffect, useState } from "react";
import { Engine, Render, World, Bodies, Mouse,Body,Runner,MouseConstraint } from "matter-js";
import styles from "./Pinball.module.css";
import defalautball from "../../assets/defalutball.png";
import chrome from "../../assets/chrome1.png"
import dogi from "../../assets/dogi1.png"
import docker from "../../assets/docker1.png"
import poke from "../../assets/poke1.png"
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";

import { setFinBallAccount } from "../../store/slices/finBallAccountSlice";
import { setFinball } from "../../store/slices/finballSlice";
const BASE_HTTP_URL = "https://j9E106.p.ssafy.io";
const skinlist={
  "크롬":chrome,
  "기본":defalautball,
  "도지코인":dogi,
  "도커":docker,
  "포켓몬볼":poke,
}
function AccountBookFinball(value) {
  const [account, setAccount] = useState<any>(null);
  const [engine, setEngine] = useState(null);
  const [render, setRender] = useState(null);
  const [balls, setBalls] = useState([]);
  const finball = useSelector((state) => state.finBallAccount);
  const ballunit=useSelector((state)=>state.finballSlice.ballunit)
  const ballcnt = useSelector((state)=>state.finballSlice.ballcnt)
  const minbalance = useSelector((state)=>state.finballSlice.minbalance)
  const ballskin=useSelector((state)=>state.skin.skin)
  const isReady = useSelector((state)=>state.finballSlice.isReady)
  // const changed = useSelector((state)=>state.finballSlice.changed)
  // const prebalance = useSelector((state)=>state.finballSlice.prebalance)
  // const ballunit=useState(1000)
  // const ballcnt = useState(0)
  // const [ballunit,setBallunit]=useState(10**((finball.account.balance).toString().length-3))
  // const [ballcnt, setBallcnt] = useState((finball.account.balance-Number((finball.account.balance).toString()[0])*10**((finball.account.balance).toString().length-1))/ballunit);
  const finBallAccount = useSelector((state) => state.finBallAccount);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // 부모 컨테이너의 크기를 가져오는 함수
  const getParentContainerSize = () => {
    const parentContainer = document.getElementById(value.value.parent); // 부모 컨테이너의 ID로 가져옴
    console.log(parentContainer)
    return {
      width: parentContainer.clientWidth,
      height: parentContainer.clientHeight,
    };
  };
  useEffect(() => {
    getFinBAllAccount();
  }, []);
  console.log(ballskin)
  const getFinBAllAccount = () => {
    axios
      .get(`${BASE_HTTP_URL}/api/fin-ball`, {
        headers: {
          Authorization: auth.accessToken,
        },
      })
      .then((response) => {
        if (finBallAccount.account.no !== undefined) {
          console.log("차액");
          console.log(
            response.data.data.account.balance - finBallAccount.account.balance
          );
        }
          dispatch((dispatch) => {
            const balance = response.data.data.account.balance;
            const balanceString = balance.toString();
            if (balanceString.length >= 3) {
              const ballunit = 10 ** (balanceString.length - 3);
              const firstDigit = Number(balanceString[0]);
              if (balance - firstDigit * 10 ** (balanceString.length - 1)-10**(balanceString.length - 1)/2<0){
                const ballcnt = Math.round((balance - firstDigit * 10 ** (balanceString.length - 1)) / ballunit);
                dispatch(
                  setFinball({
                    ballunit: ballunit,
                    ballcnt: ballcnt,
                    minbalance:firstDigit * 10 ** (balanceString.length - 1),
                  })
                  );
                
              }
              else{
                const ballcnt = Math.round((balance - firstDigit * 10 ** (balanceString.length - 1)-10**(balanceString.length - 1)/2)/ballunit);
                dispatch(
                  setFinball({
                    ballunit: ballunit,
                    ballcnt: ballcnt,
                    minbalance:firstDigit * 10 ** (balanceString.length - 1)+10**(balanceString.length - 1)/2,
                  })
                  );
              }
              } else {
                const ballunit = 1000;
                const ballcnt=0;
                dispatch(
                  setFinball({
                    ballunit: ballunit,
                    ballcnt: ballcnt,
                    minbalance:minbalance,
                  }))
                }
              });
              
              dispatch(
                setFinBallAccount({
                  account: response.data.data.account,
                  company: response.data.data.company,
                })
                );
              })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if(!isReady || ballcnt==0){
      console.log('ready')
      return;
    }
    else{
    if (!render) {
    
    console.log('initialize')
    const parentSize = getParentContainerSize();
    console.log(parentSize,'asdfasdfasdf')
    // Create a Matter.js engine
    const newEngine = Engine.create({});
    const runner = Runner.create({
      delta: 10,
      isFixed: false,
  });
    setEngine(newEngine);

    // 중력 설정
    newEngine.world.gravity.x = 0;
    newEngine.world.gravity.y = 0.6;
    console.log(value.value.parent)
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
    console.log(parentSize.width,parentSize.height,'asdfzsdfazsdfasdfds')
    // Create ground
    const ground = Bodies.rectangle(
      parentSize.width / 2,
      parentSize.height+parentSize.width * 0.2/2,
      parentSize.width * 2,
      parentSize.width * 0.2,
      {
        isStatic: true,
        render: {
          // fillStyle: "transparent",
          fillStyle: "blue",
          // strokeStyle: "transparent",
          strokeStyle: "red",
        },
      }
    );
    const wall1 = Bodies.rectangle(
      parentSize.width+parentSize.width * 0.2/2,
      parentSize.height/2,
      parentSize.width * 0.2,
      parentSize.height,
      {
        isStatic: true,
        render: {
          // fillStyle: "#4C4499",
          // fillStyle: "transparent",
          fillStyle: "red",
          // strokeStyle: "transparent",
          strokeStyle: "red",
        },
      }
    );
    const wall2 = Bodies.rectangle(
      0-parentSize.width * 0.2/2,
      parentSize.height/2,
      parentSize.width * 0.2,
      parentSize.height,
      {
        isStatic: true,
        render: {
          // fillStyle: "transparent",
          fillStyle: "red",
          // strokeStyle: "transparent",
          strokeStyle: "red",
        },
      }
    );
    const wall3 = Bodies.rectangle(
      0,
      0-parentSize.width * 0.2/2,
      parentSize.width * 2,
      parentSize.width * 0.2,
      {
        isStatic: true,
        render: {
          // fillStyle: "transparent",
          fillStyle: "red",
          // strokeStyle: "transparent",
          strokeStyle: "red",
        },
      }
    );
    // Create a mouse and add mouse interaction
    const mouse = Mouse.create(newRender.canvas);
    const mouseConstraint = MouseConstraint.create(newEngine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        }
      }
    });

    // // Add mouse constraint to the world
    World.add(newEngine.world, mouseConstraint);
    // Create balls array
    for (let i = 0; i < ballcnt; i++) {
      const ball = Bodies.circle(
        Math.random() * parentSize.width,
        Math.random() * parentSize.height/5,
        Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 25,
        {
          density: 15,
          frictionAir: 0.06,
          restitution: 0.01,
          friction: 0.01,
          isStatic: false,
          isSensor:false,
          render: {
            fillStyle: "#05CD01",
            strokeStyle: "white",
            lineWidth: 3,
            // opacity:0.5,
            sprite: {
              // texture: ballskin.image,
              texture: skinlist[ballskin.name],
              xScale: Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23/29,
              yScale: Math.sqrt(parentSize.width ** 2 + parentSize.height ** 2) / 23/29,
            },
          },
        }
      );
      balls.push(ball);
    }
    const Boundary = [ground, wall1, wall2, wall3];
    World.add(newEngine.world, [...Boundary, ...balls]);

    Runner.run(runner, newEngine);
    Render.run(newRender);
  }
}
  }, [finball]);

  return (
    <div  id="pinball-canvas">
    </div>
  );
}

export default AccountBookFinball;
