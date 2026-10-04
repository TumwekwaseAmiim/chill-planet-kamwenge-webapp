export async function shareContent({title,text,url}){
  if(navigator.share) return navigator.share({title,text,url});
  await navigator.clipboard.writeText(url || text);
  return true;
}
