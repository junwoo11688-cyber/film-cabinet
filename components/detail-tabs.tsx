"use client";

import { useId, useState } from "react";

export type DetailTab={id:string;label:string;content:React.ReactNode};

export function DetailTabs({items}:{items:DetailTab[]}) {
  const [active,setActive]=useState(items[0]?.id);
  const prefix=useId().replaceAll(":","");
  const current=items.find(x=>x.id===active)||items[0];
  const move=(event:React.KeyboardEvent<HTMLButtonElement>,index:number)=>{
    if(event.key!=="ArrowRight"&&event.key!=="ArrowLeft"&&event.key!=="Home"&&event.key!=="End")return;
    event.preventDefault();
    const next=event.key==="Home"?0:event.key==="End"?items.length-1:(index+(event.key==="ArrowRight"?1:-1)+items.length)%items.length;
    setActive(items[next].id);
    document.getElementById(`${prefix}-tab-${items[next].id}`)?.focus();
  };
  return <section className="detail-tabs-shell"><div className="detail-tablist" role="tablist" aria-label="상세 정보">{items.map((item,index)=><button key={item.id} id={`${prefix}-tab-${item.id}`} role="tab" aria-controls={`${prefix}-panel-${item.id}`} aria-selected={current.id===item.id} tabIndex={current.id===item.id?0:-1} onClick={()=>setActive(item.id)} onKeyDown={event=>move(event,index)}>{item.label}</button>)}</div><div id={`${prefix}-panel-${current.id}`} className="detail-tabpanel" role="tabpanel" aria-labelledby={`${prefix}-tab-${current.id}`} tabIndex={0}>{current.content}</div></section>;
}
