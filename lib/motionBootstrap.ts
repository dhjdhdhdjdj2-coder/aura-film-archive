export const MOTION_BOOTSTRAP_SCRIPT =
  "var m=null;try{m=localStorage.getItem('aura-motion')}catch(e){}var r=false;try{r=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}document.documentElement.dataset.motion=m==='full'||m==='reduced'?m:r?'reduced':'full'";
