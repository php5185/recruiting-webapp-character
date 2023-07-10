import { useState, useEffect } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';
import { List } from 'antd'
import axios from 'axios';

const CONST_INTELLIGENCE = 'Intelligence';
const URL = 'https://recruiting.verylongdomaintotestwith.ca/api/{php5185}/character';


function App() {
  
  const [attribute, setAttribute] = useState({});
  const [attributeCount, setAttributeCount] = useState(0);

  const [modifier, setModifier] = useState({});
  const [points, setPoints] = useState(10);
  const [skillPoints, setSkillPoints] = useState({});
  const [pointsCount, setPointsCount] = useState(0);
  const [classes, setClasses] = useState({});
  const [classList, setClassList] = useState([]);

  const initCharacter = async () => {

      const { data } = await axios.get(URL);
      if(data.statusCode == 200 && data.body !== undefined){
        setAttribute(data.body.attribute);
        setAttributeCount(data.body.attributeCount);
        setModifier(data.body.modifier);
        setPoints(data.body.points);
        setSkillPoints(data.body.skillPoints);
        setClasses(data.body.classes);
        setClassList(data.body.classList);
      }
      else{
        let startAttributes = {}
        let startModifiers = {}

        let startAttributeCount = 0;

        ATTRIBUTE_LIST.forEach(element => {
          startAttributes[element] = 10;
          startModifiers[element] = 0;
          startAttributeCount += 10;
        });
        setAttribute(startAttributes);
        setModifier(startModifiers);

        let startPoints = 10 + (4 * modifier[CONST_INTELLIGENCE]);
        setPoints(startPoints);

        let startSkills = {};

        SKILL_LIST.forEach(element => {
          startSkills[element.name] = 0;
        });

        setSkillPoints(startSkills);

        let startClases = {}
        let allClasses = [];

        for (const key in CLASS_LIST) {
          startClases[key] = false;
          allClasses.push(key);
        }

        setClasses(startClases);
        setClassList(allClasses);
        setAttributeCount(startAttributeCount);
        setPointsCount(0);

      }
  }

  useEffect(() => {
    initCharacter();
  }, []);


  useEffect(()=>{
    classList.forEach( key =>{
      let classVal = updateClasses(key);
      setClasses((prevStatus) => ({
        ...prevStatus,
       [key]: classVal
      }))
    })
  
    updateModifierForAttribute();
  
  }, [attribute])


  useEffect(() => {
    updateSkillPoints();
  }, [modifier[CONST_INTELLIGENCE]]);
  
  
  const updateSkillPoints = () => {
    
    let newPoints = 10 + (4 * modifier[CONST_INTELLIGENCE]);
    setPoints(newPoints);
  }

  const updateModifierForAttribute = () => {

    ATTRIBUTE_LIST.forEach( val =>{
      let newModifierValue = 0;
  
      if (attribute[val] <= 7){
        newModifierValue = -2;
      }else if (attribute[val] >=8 && attribute[val] <=9 ){
        newModifierValue = -1;
      }else if(attribute[val] >=12 && attribute[val] <14){
        newModifierValue = 1;
      }else if (attribute[val] >=14 && attribute[val] <20){
        newModifierValue = 2;
      }else if (attribute[val] >=20){
        newModifierValue = 5;
      }
  
      setModifier((prevModifier) => ({
        ...prevModifier,
        [val]: newModifierValue
      }))
    })
  
  }

  const updateClasses = (classKey) => {
    const classReq = CLASS_LIST[classKey];
    for (const field in classReq){
     
      if (attribute[field] < classReq[field]){
        return false;
      }
    }
    return true;
  }

  const upgradeAttribute = event => {
    //check points
    if (attributeCount === 70) {
      alert("Maximun 70 Attribute points allowed.");
      return;
    }
  
    setAttributeCount((prevCount => (prevCount+1)));
    const val = event.currentTarget.id;
  
    setAttribute((prevAttribute) => ({
      ...prevAttribute,
     [val]: prevAttribute[val] + 1
    }))
    
  };

  const downgradeAttribute = event => {
    setAttributeCount((prevCount => (prevCount-1)));
    const val = event.currentTarget.id;
  
    setAttribute((prevAttribute) => ({
      ...prevAttribute,
     [val]: prevAttribute[val] - 1
    }))

  }

  const showClassDetails = event => {
    const val = event.currentTarget.id;
    const classReq = CLASS_LIST[val];
    document.getElementById("details").innerText = JSON.stringify(classReq);
  }

  const upgradeSkill = event => {
    //increase up to points
    if (pointsCount>=points) {
      alert(`You have use all your available points`);
      return;
    }
  
    const val = event.currentTarget.id;
    setSkillPoints((prevSkills) => ({
      ...prevSkills,
      [val]: prevSkills[val] +1
    }))
    setPointsCount(prevCount => prevCount +1);
  }

  const downgradeSkill = event => {
    const val = event.currentTarget.id;
    if(skillPoints[val]<=0){
      alert(`Skill level at minimun`);
      return;
    }
    
    setSkillPoints((prevSkills) => ({
      ...prevSkills,
      [val]: prevSkills[val] -1
    }))
    setPointsCount(prevCount => prevCount -1);
  }


  const saveCharacter = event => {
    let data = JSON.stringify({
      attribute: attribute,
      attributeCount: attributeCount,
      modifier: modifier,
      points: points,
      skillPoints: skillPoints,
      classes: classes,
      classList: classList
    })
   

    axios.post(URL, data, {
      headers: {
          'Content-Type': 'application/json',
      }
  })
    .then((response) => {
      console.log(response);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise -- Paola Peralta</h1>
      </header>
      <section className="App-section">

        <div className='Attributes'>
        <List
            size="small"
            header={<h2>Attributes</h2>}
            bordered
            dataSource={ATTRIBUTE_LIST}
            renderItem={(key) =>  <List.Item>
              {key}: {attribute[key]} (modifier: {modifier[key]})
              <button id={key} onClick={upgradeAttribute}>+</button>
              <button id={key} onClick={downgradeAttribute}>-</button>
              </List.Item>}
        />

        </div>

        <div className='Classes'>

          <List
              size="small"
              header={<h2>Classes</h2>}
              bordered
              dataSource={classList}
              renderItem={(key) =>  <List.Item>
                <button id={key} onClick={showClassDetails} style={{ background: classes[key] ? 'green' : 'white' }}>{key}</button>
                </List.Item>}
            />

          <p id="details"></p>

        </div>



        <div className='Skills'>
          <h3> Total skill points available: {points}</h3>
          <List
            size="small"
            header={<h2>Skills</h2>}
            bordered
            dataSource={SKILL_LIST}
            renderItem={(key) =>  <List.Item>
              {key.name}: {skillPoints[key.name]} (modifier: {key.attributeModifier}): {modifier[key.attributeModifier]} 
              <button id={key.name} onClick={upgradeSkill}>+</button>
              <button id={key.name} onClick={downgradeSkill}>-</button>
               Total: {skillPoints[key.name] + modifier[key.attributeModifier]}
              </List.Item>}
          />
          
        </div>


        <div className='Save'>
         <button onClick={saveCharacter}>Save Character</button>
        </div>


      </section>
    </div>
  );
}

export default App;
