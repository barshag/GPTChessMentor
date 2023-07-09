"use client";
import Image from 'next/image'
import { Chessboard } from "react-chessboard";
import { OpenAI } from "langchain/llms/openai";
import React, { useState } from 'react';
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import Select from 'react-select';
import  Chess  from 'chess.js';



export default function Home() {

  const [apiKey, setApiKey] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [explaniation, setExplanation] = useState("");
  const [playername, setplayer] = useState("");
  const [color, setcolor] = useState("White");

  // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
  
  const [moveHistory, setMoveHistory] = useState([]);
  const [game, setGame] = useState(new Chess('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'));
  
  
  const players = [
    { value: 'Kasparov', label: 'Garry Kasparov' },
    { value: 'Fischer', label: 'Bobby Fischer' },
    { value: 'Carlsen', label: 'Magnus Carlsen' },
    { value: 'Anand', label: 'Viswanathan Anand' },
    { value: 'Karpov', label: 'Anatoly Karpov' },
    { value: 'Alekhine', label: 'Alexander Alekhine' },
    { value: 'Capablanca', label: 'José Capablanca' },
    { value: 'Tal', label: 'Mikhail Tal' },
    { value: 'Botvinnik', label: 'Mikhail Botvinnik' },
    { value: 'Lasker', label: 'Emanuel Lasker' },
    { value: 'Hikaru', label: 'Hikaru nakamura' },

  ];

  const color_list = [
    { value: 'White', label: 'White' },
    { value: 'Black', label: 'Black' },

  ]


  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    setTimeout(makeRandomMove, 200);
    return true;
  }



  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }


  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);

  };

  const handlecolor = (selectedcolor:any) => {
    console.log(`You've selected ${selectedcolor.label}`);
    setcolor(selectedcolor.label);

  };

  


  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue2(event.target.value);
  
  };

  const handleFEN = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGame(Chess(event.target.value));
    //setFen(event.target.value);
  };

  

  const handleChangePlayer = (selectedPlayer:any) => {
    console.log(`You've selected ${selectedPlayer.label}`);
    setplayer(selectedPlayer.label)
  };

  const  handleSubmit =  async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //alert(`Submitted Values: ${inputValue1}, ${inputValue2}`);
    console.log(`API Key for OpenAI model: ${apiKey}`);
    if(apiKey=="")
    {
      alert("please insert a valid open-api key")
      return
    }
    var model = new OpenAI({ openAIApiKey: apiKey, temperature: 0.5 });
    const template = "Act like {player}  (using the houmor and), Can you explain the tactics and the strategy behind the last move of color {color} in this chess position {position}, and add comment/joke in they style of: {player}  ?";
    
    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["position","player","color"],
    });

   


  

    const chain = new LLMChain({ llm: model, prompt: prompt });

    // const res = await prompt.format({ product: "colorful socks" });
    // console.log(res);
    const res = await chain.call({ position: game.pgn(), player:playername , color:color});
    console.log(res);

    setExplanation(res.text)
  };



  return (

    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <a href="https://github.com/barshag/GPTChessMentor" className="github-corner" aria-label="View source on GitHub">
      
    <svg width="80" height="80" viewBox="0 0 250 250" style={{ fill: "#151513", color: "#fff", position: "absolute", top: 0, border: 0, right: 0 }} aria-hidden="true">
      <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
      <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: "130px 106px" }} className="octo-arm"></path>
      <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path>
    </svg>
  </a>
<div>
  
</div>



  <div>

  <div>

      <h1 className="text-4xl md:text-6xl font-bold text-blue-500">Welcome to GPTChessMentor!</h1>
 
  </div>

  <table style={{ width: '100%' }}>
    <tr>   
    <td style={{ width: '60%' }}>
         1. Enter OpenAI credential  <input 
          type="text" 
          value={apiKey} 
          onChange={handleChange1} 
          placeholder="Enter OPENAI credential" />

        <form onSubmit={handleSubmit}>
          <br></br>

  2. Choose your Grandmaster mentor:
  <Select options={players}  defaultValue="Carlsen" onChange={handleChangePlayer} />


      3. Paste FEN board/ or play in the board:
        <input 
          type="text" 
          value={game.fen()} 
          onChange={handleFEN} 
          // disabled={true}
          placeholder="Enter FEN position" 
          style={{ width: '100%', height:'100%'  ,   wordWrap: 'break-word',
          overflow: 'auto' }} // Here we set the width of the input field to 80% of its parent's width
        /> 
        
     
        4. Choose color:
        <Select options={color_list} onChange={handlecolor}  />

        
        {/* <input 
          type="text" 
          value={inputValue2} 
          onChange={handleChange2} 
          placeholder="enter the current position" 
        /> */}
  <br></br>
  <br></br>
  <br></br>
       4. Get your mentor analysis <button className="submit-button" type="submit">Submit</button>
       <br></br>
       <br></br>
       5. Get explanations of the last move:   
       <h1>{explaniation }</h1> 
      </form>
          </td>

          <td>
          <div style={{ width: '600px', height: '600px' }}>
    <Chessboard  position={game.fen()} onPieceDrop={onDrop} />

  </div>

          </td>
          <td> &nbsp;&nbsp;&nbsp;&nbsp;</td>
          <td> 
 
          < Image src="/magnus.png" width= "550" height="600" alt ="magnus as coach"/>
          &nbsp;
         < Image src="/kasparov2.png" width= "550" height="600" alt ="kasparov as chess coach"/>
         &nbsp;
         < Image src="/hikaru.jpeg" width= "550" height="600" alt ="hikaru as chess coach"/>
         {/* <Image src="/coach.png" width= "600" height="700" alt ="chess coach"/> */}
          </td>
  </tr>
<tr>

<div>

    {/* {game.fen()} */}
    {/* {game.pgn()} */}

    </div>
</tr>
    </table>
 
    </div>

    <div></div>

<br></br>

🐛Known issues 🐛:<br></br>
- There are not visual explanations of the moves.<br></br>
<br></br>
    
<p> Consider support me via:  &nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://ko-fi.com/thegeneralistguy">A coffee ☕ </a>     &nbsp;&nbsp;
<a href="http://www.tiktak-studio.com">Business headshots📷 </a>&nbsp;&nbsp;
 <a href="http://dating.tiktak-studio.com">Dating Headshots💑</a>
</p>
    </main>
  )

}
