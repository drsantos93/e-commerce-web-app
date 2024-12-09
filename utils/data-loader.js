import { useState } from "react";

let store = [];

export function useData(){
    const [data,setData] = useState(null);

    window.addEventListener('dataFetch', ()=>setData(store))

    
    return data;
}

export function prefetchData(fn){
    
    fn().then((data)=>{
        console.log(data, "data-loader")
        store = data;
        window.dispatchEvent(new Event('dataFetch'));
    })
}