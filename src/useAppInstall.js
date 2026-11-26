import {useEffect,useState} from 'react';

const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||!!window.Capacitor?.isNativePlatform?.();

export function useAppInstall(showInstructions){
  const [installed,setInstalled]=useState(standalone);
  const [installPrompt,setInstallPrompt]=useState(null);
  useEffect(()=>{
    const ready=event=>{event.preventDefault();setInstallPrompt(event)};
    const done=()=>{setInstalled(true);setInstallPrompt(null)};
    window.addEventListener('beforeinstallprompt',ready);
    window.addEventListener('appinstalled',done);
    return ()=>{
      window.removeEventListener('beforeinstallprompt',ready);
      window.removeEventListener('appinstalled',done);
    };
  },[]);
  async function install(){
    if(!installPrompt){showInstructions();return}
    setInstallPrompt(null);
    try{await installPrompt.prompt()}catch{showInstructions()}
  }
  return {installed,install};
}
