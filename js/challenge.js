import { Store, uid } from "./storage.js";
const scoreInput=document.querySelector("#challengeScore");
scoreInput.value=Store.get("cp_last_result",{score:0}).score||0;

const params=new URLSearchParams(location.search);
if(params.get("id")){
  document.querySelector("#incomingChallenge").classList.remove("hidden");
  const name=params.get("name")||"A friend";
  const score=Number(params.get("score")||0);
  document.querySelector("#challengerTitle").textContent=`${name} challenged you`;
  document.querySelector("#targetScore").textContent=score;
  document.querySelector("#acceptChallenge").addEventListener("click",()=>Store.set("cp_active_challenge",{id:params.get("id"),name,score}));
}
document.querySelector("#createChallengeBtn").addEventListener("click",()=>{
  const name=document.querySelector("#challengerName").value.trim()||"A Chill Planet player";
  const score=Number(scoreInput.value||0);
  const id=uid("CH");
  const url=new URL(location.href); url.search=""; url.searchParams.set("id",id);url.searchParams.set("name",name);url.searchParams.set("score",score);
  document.querySelector("#challengeLink").value=url.toString();
  document.querySelector("#challengeOutput").classList.remove("hidden");
});
document.querySelector("#copyChallenge").addEventListener("click",async()=>{await navigator.clipboard.writeText(document.querySelector("#challengeLink").value);document.querySelector("#copyChallenge").textContent="Copied!";});
document.querySelector("#shareChallenge").addEventListener("click",async()=>{const url=document.querySelector("#challengeLink").value;if(navigator.share)await navigator.share({title:"Chill Planet Challenge",text:"Can you beat my Chill Planet score?",url});else await navigator.clipboard.writeText(url);});
