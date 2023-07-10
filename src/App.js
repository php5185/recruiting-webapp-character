import { useState, useEffect } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';
import { List } from 'antd'

const CONST_INTELLIGENCE = 'Intelligence';


function App() {
  //const [num, setNum] = useState(0);
  const [attribute, setAttribute] = useState({});
  const [attributeCount, setAttributeCount] = useState(0);

  const [modifier, setModifier] = useState({});
  const [points, setPoints] = useState(10);
  const [skillPoints, setSkillPoints] = useState({});
  const [pointsCount, setPointsCount] = useState(0);
  const [classes, setClasses] = useState({});
  const [classList, setClassList] = useState([]);

  const initCharacter = async () => {

    //   const { data } = await axios.get(
    //     `http://localhost:3001/random-quiz`
    // );

    // if data {

    // }
    // else{

    // }

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise -- Paola Peralta</h1>
      </header>
      <section className="App-section">
        {/* <div>
          Value:
          {num}
          <button>+</button>
          <button>-</button>
        </div> */}

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


      </section>
    </div>
  );
}

export default App;
