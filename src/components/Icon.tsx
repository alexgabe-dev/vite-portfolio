import type { ReactNode } from 'react';
type IconName='spark'|'diamond'|'grid'|'check'|'arrow-up-right'|'arrow-left'|'arrow-right'|'arrow-down'|'plus'|'close';
const shapes:Record<IconName,ReactNode>={
 spark:<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07 19.07 4.93"/>,
 diamond:<><path d="m12 3 9 9-9 9-9-9 9-9Z"/><path d="m12 8 4 4-4 4-4-4 4-4Z" fill="currentColor" stroke="none"/></>,
 grid:<><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8m-4-4h8"/></>,
 check:<path d="m5 12 4 4L19 6"/>,
 'arrow-up-right':<path d="M6 18 18 6M6 6h12v12"/>,
 'arrow-left':<path d="M19 12H5m6-6-6 6 6 6"/>,
 'arrow-right':<path d="M5 12h14m-6-6 6 6-6 6"/>,
 'arrow-down':<path d="M12 5v14m-6-6 6 6 6-6"/>,
 plus:<path d="M12 5v14M5 12h14"/>,
 close:<path d="m6 6 12 12M18 6 6 18"/>,
};
export function Icon({name}:{name:IconName}){return <svg className="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{shapes[name]}</svg>;}
