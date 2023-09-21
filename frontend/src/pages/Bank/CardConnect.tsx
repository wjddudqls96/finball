import * as React from 'react';
import { useState,useEffect } from "react";
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Logo from "./CardConnectLogo"
import  Button from "@mui/material/Button";
import styles from "./BankInfo.module.css"
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
export default function BankConnect() {
    interface INfo{
      name:string;
      img:string;
      code:string;
      connected:boolean;
    }
  const location = useLocation();
  const List = location.state?.cardCompanyCodeList;
  const [state, setState] = useState([]);
  const [cnt,setCnt]=useState(0)
  const [loading,setLoading]=useState(true)
  const [toggledItems, setToggledItems] = useState({})
  // const checkselect= () => {
  //   const newData = state.map(item => {
  //     return { ...item, selected: true };
  // });
  //   setState(newData);

  // }
  const  findCard = async() => {
    await axios({
      method: "post",
      url: `https://j9e106.p.ssafy.io/card`,
      headers: {
       Authorization: localStorage.getItem("accessToken"),
              },
      data:
        {
            "cardCompanyCodeList" : List
        }
    })  
      .then((res) => {
        setState(res.data.data.cardDtoList)
        const initialToggledItems = {};
        res.data.data.cardDtoList.map((item) => {
          initialToggledItems[item.cardName] = true; // 예를 들어, 항목의 고유 ID를 사용
        });
        setToggledItems(initialToggledItems);
      })
      .catch((err) => {
        console.log("삐빅", err);
      });

  }
  useEffect(()=>{
    findCard()
  },[])

  useEffect(() => {
    if (state.length > 0) { // 길이 일치 확인
      setLoading(false)
      let count = 0;
      for (let i = 0; i < state.length; i++) {
        const Name = state[i]; // 회사 이름 가져오기
        if (toggledItems[Name.cardName] === true) {
          count += 1;
        }
      }
      setCnt(count);
    }
  }, [toggledItems, state, List]); // 종속성 목록에 List 추가
  
  // useEffect(()=>{
  //   if (state.length>0){
  //     checkselect()
  //   }
  // },[loading])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setToggledItems((state) => {
        const Name=event.target.name
            return { ...state, [Name]:!state[Name] };
          // 변경할 필요가 없는 항목은 그대로 반환
      });
    };
    const handlereset = () => {
        findCard()
    };

  return (
    <>
    {loading ? "Lodaing...":
      <FormControl component="fieldset" variant="standard" style={{width:"100%"}}>
        <div className={styles.head}>
            <div style={{fontSize:'3vh',fontWeight:'bold'}}> 카드</div>
            <div style={{fontSize:'1vh',alignItems:'center'}} onClick={handlereset}>선택 해제</div>
            </div>
        <div style={{fontSize:'2vh',color:'grey',textAlign:'start'}}>연결할 카드를 선택해주세요</div>
      <FormGroup style={{height:"210vh"}}>
      {state.map((v,i) => (
         <div className={styles.labelbox} key={i}>
         <FormControlLabel
           control={
             <Switch checked={toggledItems[v.cardName ]} onChange={handleChange} name={v.cardName} />
           }
           label={<Logo value={v}/>}
           labelPlacement="start"
           />
       </div>
    ))}

      </FormGroup>
      <Link to='/'
      style={{ color: 'white', position: "sticky", bottom: "62px", backgroundColor: '#7165E3', height: "40px", borderRadius: "10px", display: "flex", alignItems: "center",justifyItems:"center" }}>
        <label style={{ backgroundColor: "#7165E3", margin: "0", paddingLeft: "130px", display: "inline-block"}}>
          {cnt}개 카드 선택
        </label>
      </Link>
      {/* <Button variant="contained" color="success" style={{position:"sticky",bottom:"62px",right:"15px"}} >{cnt}개 연결하기</Button> */}
    </FormControl>
  }
  </>
  );
}