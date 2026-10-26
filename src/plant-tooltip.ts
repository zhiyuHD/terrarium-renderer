import { plotPosition, residentScale } from './geometry.js';
import { sceneSize, type LandScene } from './types.js';
const names: Record<string,string> = { fern:'蕨类', clover:'三叶草', moss:'苔藓', basil:'罗勒', bean:'豆苗', sunflower:'向日葵', mint:'薄荷', daisy:'雏菊', lavender:'薰衣草', tomato:'番茄', strawberry:'草莓', mushroom:'蘑菇' };
export function createPlantTooltip(canvas:HTMLCanvasElement,language:'zh'|'en') {
  let state:LandScene|undefined;
  const tooltip=document.createElement('div');tooltip.setAttribute('role','tooltip');tooltip.hidden=true;
  Object.assign(tooltip.style,{position:'fixed',zIndex:'100',pointerEvents:'none',padding:'9px 13px',borderRadius:'14px',background:'#293b2d',color:'#f2f0d9',font:'13px sans-serif',boxShadow:'0 4px 14px #13201430',maxWidth:'250px'});
  const show=(event:PointerEvent)=>{
    if(!state)return;
    const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*800/rect.width,y=(event.clientY-rect.top)*500/rect.height,size=sceneSize(state),scale=residentScale(size);
    const plant=[...state.plants].reverse().find(p=>{const point=plotPosition(p.x,p.y,size);return Math.abs(point.x-x)<28*scale&&y>point.y-(30+p.stage*23)*scale&&y<point.y+8;});
    if(!plant){tooltip.hidden=true;return;}
    tooltip.textContent=`${language==='zh'?(names[plant.species]??plant.species):plant.species} · ${plant.id} (${plant.x},${plant.y}) · ${language==='zh'?'健康':'Health'} ${Math.round(plant.health??100)}%${plant.fruitReady?(language==='zh'?' · 果实成熟':' · Ripe fruit'):''}`;
    if(!tooltip.isConnected)document.body.append(tooltip);
    tooltip.hidden=false;tooltip.style.left=`${Math.max(4,Math.min(window.innerWidth-260,event.clientX+12))}px`;tooltip.style.top=`${Math.max(4,event.clientY-54)}px`;
  };
  const hide=()=>{tooltip.hidden=true;};
  canvas.addEventListener('pointermove',show);canvas.addEventListener('pointerdown',show);canvas.addEventListener('pointerleave',hide);
  return {setState(next:LandScene){state=next;hide();},dispose(){canvas.removeEventListener('pointermove',show);canvas.removeEventListener('pointerdown',show);canvas.removeEventListener('pointerleave',hide);tooltip.remove();}};
}
