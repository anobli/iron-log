import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

/* ── Google Fonts ── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');

    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

    :root {
      --cream:   #faf7f2;
      --cream2:  #f3ede3;
      --cream3:  #ecdfd0;
      --sand:    #e0d0b8;
      --coral:   #e8714a;
      --coral2:  #f09070;
      --sage:    #6b9e7e;
      --sage2:   #a8c8b4;
      --sky:     #6b9bc4;
      --lavender:#9b85c4;
      --gold:    #c9903a;
      --text:    #2d2416;
      --text2:   #6b5c42;
      --text3:   #a89880;
      --white:   #ffffff;
      --radius:  14px;
      --shadow:  0 2px 12px rgba(45,36,22,.08);
      --shadow2: 0 4px 24px rgba(45,36,22,.12);
    }

    body { background: var(--cream); margin: 0; }

    input, select, button { font-family: 'Sora', sans-serif; }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

    .card {
      background: var(--white);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--cream3);
    }

    .btn-coral {
      background: linear-gradient(135deg, var(--coral), var(--coral2));
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 14px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Sora', sans-serif;
      cursor: pointer;
      width: 100%;
      letter-spacing: .3px;
      box-shadow: 0 4px 16px rgba(232,113,74,.3);
      transition: transform .15s, box-shadow .15s;
    }
    .btn-coral:active { transform: scale(.97); }

    .tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 9px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .3px;
    }

    .pill-nav button {
      flex: 1;
      background: none;
      border: none;
      padding: 13px 0 10px;
      font-size: 20px;
      cursor: pointer;
      border-bottom: 2.5px solid transparent;
      transition: border-color .2s;
    }
    .pill-nav button.active { border-bottom-color: var(--coral); }

    .set-row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }

    @keyframes fadeUp {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .fade-up { animation: fadeUp .3s ease both; }

    .supp-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1.5px solid var(--cream3);
      background: var(--white);
      margin-bottom: 8px;
      transition: border-color .2s, background .2s;
    }
    .supp-item.done { border-color: var(--sage2); background: #f0f8f3; }

    .profile-field { width: calc(50% - 5px); margin-bottom: 10px; }
    .profile-val {
      padding: 10px 12px;
      background: var(--cream);
      border: 1px solid var(--cream3);
      border-radius: 10px;
      font-size: 14px;
      color: var(--text);
      min-height: 42px;
      display: flex;
      align-items: center;
    }

    .type-pill {
      padding: 6px 12px; border-radius: 20px;
      font-size: 11px; font-weight: 600; cursor: pointer;
      border: 1.5px solid; transition: all .15s;
    }

    .day-btn {
      flex-shrink: 0; padding: 6px 13px;
      border-radius: 20px; font-size: 11px; font-weight: 600;
      cursor: pointer; border: 1.5px solid var(--cream3);
      background: var(--white); color: var(--text2);
      font-family: 'Sora', sans-serif; transition: all .15s;
    }
    .day-btn.active { background: var(--coral); border-color: var(--coral); color: #fff; }

    .timer-bar {
      position: fixed; bottom: 76px; left: 16px; right: 16px;
      background: var(--white); border-radius: 16px;
      box-shadow: 0 8px 32px rgba(45,36,22,.18);
      border: 1px solid var(--cream3);
      padding: 14px 16px; z-index: 999;
    }
  `}</style>
);

/* ── CONSTANTS ── */
const MUSCLE_GROUPS = ["Pectoraux","Dos","Épaules","Biceps","Triceps","Jambes","Abdominaux","Fessiers"];
const DAYS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const TRAINING_TYPES = ["Normal","Superset","Biset","Triset","Giant Set","Drop Set","Pyramidal","Rest-Pause"];
const BODYWEIGHT_EXERCISES = new Set(["Tractions","Dips","Pompes lestées","Dips banc","Relevé de jambes","Ab wheel","Gainage","Crunchs","Fentes","Fentes bulgares"]);
const EXERCISES = {
  "Pectoraux":  ["Développé couché","Développé incliné","Écarté poulie","Dips","Pompes lestées","Développé décliné"],
  "Dos":        ["Tractions","Rowing barre","Tirage poulie haute","Rowing haltère","Soulevé de terre","T-Bar Row"],
  "Épaules":    ["Développé militaire","Élévations latérales","Oiseau","Arnold Press","Tirage menton","Face Pull"],
  "Biceps":     ["Curl barre","Curl haltères","Curl concentré","Curl marteau","Curl poulie","Drag curl"],
  "Triceps":    ["Barre front","Extensions poulie","Dips banc","Kickback","Close grip bench","Skull crusher"],
  "Jambes":     ["Squat","Leg press","Fentes","Leg curl","Extension jambes","Soulevé de terre jambes tendues","Hack squat"],
  "Abdominaux": ["Crunchs","Gainage","Relevé de jambes","Russian twist","Ab wheel","Cable crunch"],
  "Fessiers":   ["Hip thrust","Fentes bulgares","Abduction poulie","Kickback poulie","Squat sumo"],
};
const TYPE_COLORS = {
  "Normal":"#a89880","Superset":"#9b85c4","Biset":"#6b9bc4","Triset":"#6b9e7e",
  "Giant Set":"#e8714a","Drop Set":"#c05040","Pyramidal":"#c9903a","Rest-Pause":"#b07ab0"
};
const MUSCLE_COLORS = ["#e8714a","#6b9e7e","#6b9bc4","#9b85c4","#c9903a","#c05878","#7ab0b0","#8b9e6b"];

const INITIAL_WORKOUTS = [
  { id:1, date:"2025-03-01", muscle:"Pectoraux", exercise:"Développé couché", type:"Normal", sets:[{reps:10,weight:80,rest:90},{reps:8,weight:85,rest:120},{reps:7,weight:87.5,rest:120}] },
  { id:2, date:"2025-03-08", muscle:"Pectoraux", exercise:"Développé couché", type:"Normal", sets:[{reps:10,weight:82.5,rest:90},{reps:9,weight:87.5,rest:120},{reps:8,weight:90,rest:120}] },
  { id:3, date:"2025-03-15", muscle:"Dos",       exercise:"Tractions",        type:"Superset", sets:[{reps:8,weight:10,rest:90},{reps:7,weight:12.5,rest:120},{reps:6,weight:15,rest:120}] },
  { id:4, date:"2025-03-22", muscle:"Pectoraux", exercise:"Développé couché", type:"Normal", sets:[{reps:10,weight:85,rest:90},{reps:9,weight:90,rest:120},{reps:8,weight:92.5,rest:120}] },
  { id:5, date:"2025-03-29", muscle:"Dos",       exercise:"Tractions",        type:"Biset",  sets:[{reps:9,weight:12.5,rest:90},{reps:8,weight:15,rest:120},{reps:7,weight:17.5,rest:120}] },
];

/* ── HELPERS ── */
const fmtDate = (d) => { const [,m,day]=d.split("-"); return `${day}/${m}`; };
const calcVol  = (sets) => sets.reduce((a,s)=>a+s.reps*s.weight,0);
const calcMax  = (sets) => Math.max(...sets.map(s=>s.weight));
const bmiCalc  = (w,h) => h>0 ? (w/((h/100)**2)).toFixed(1) : "—";
const getLast  = (ws,ex) => [...ws].filter(w=>w.exercise===ex).sort((a,b)=>b.date.localeCompare(a.date))[0]||null;
const suggest  = (sets) => {
  if(!sets?.length) return [];
  const ok=sets.every(s=>s.reps>=8);
  return sets.map(s=>({...s,weight:ok?s.weight+2.5:s.weight}));
};
const isPR = (w,all) => {
  const prev=all.filter(x=>x.exercise===w.exercise&&x.id!==w.id);
  return prev.length>0 && calcMax(w.sets)>Math.max(...prev.map(x=>calcMax(x.sets)));
};
const muscleColor = (m) => MUSCLE_COLORS[MUSCLE_GROUPS.indexOf(m)%MUSCLE_COLORS.length];

/* ── TIMER ── */
function RestTimer({seconds,onClose}) {
  const [rem,setRem]=useState(seconds);
  const [done,setDone]=useState(false);
  useEffect(()=>{
    setRem(seconds);setDone(false);
    const iv=setInterval(()=>setRem(r=>{
      if(r<=1){clearInterval(iv);setDone(true);return 0;}
      return r-1;
    }),1000);
    return ()=>clearInterval(iv);
  },[seconds]);
  const pct=((seconds-rem)/seconds)*100;
  const m=Math.floor(rem/60),s=rem%60;
  return (
    <div className="timer-bar fade-up">
      <div style={{height:4,background:"var(--cream2)",borderRadius:4,marginBottom:10,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:done?"var(--sage)":"var(--coral)",borderRadius:4,transition:"width 1s linear"}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,marginBottom:2}}>{done?"Récup terminée 🎉":"Récupération"}</div>
          <div style={{fontSize:34,fontWeight:800,color:done?"var(--sage)":"var(--coral)",fontFamily:"'Playfair Display',serif",lineHeight:1}}>
            {done?"Go ! 💪":`${m}:${String(s).padStart(2,"0")}`}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {!done&&<button onClick={onClose} style={{padding:"8px 14px",background:"var(--cream)",border:"1px solid var(--cream3)",borderRadius:10,color:"var(--text2)",fontSize:12,cursor:"pointer",fontWeight:500}}>Skip</button>}
          <button onClick={onClose} style={{padding:"8px 16px",background:done?"var(--sage)":"var(--cream2)",border:"none",borderRadius:10,color:done?"#fff":"var(--text2)",fontSize:12,cursor:"pointer",fontWeight:600}}>
            {done?"Top !":"✕"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── INP / LBL styles ── */
const inp = {display:"block",width:"100%",padding:"12px 14px",background:"var(--cream)",border:"1.5px solid var(--cream3)",borderRadius:10,color:"var(--text)",fontSize:14,fontFamily:"'Sora',sans-serif",outline:"none",boxSizing:"border-box",marginBottom:4,appearance:"none",WebkitAppearance:"none",transition:"border-color .2s"};
const lbl = {display:"block",fontSize:11,color:"var(--text3)",fontWeight:600,letterSpacing:.5,marginBottom:5,marginTop:14};

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function App() {
  const [view,setView]       = useState("log");
  const [workouts,setWorkouts] = useState(INITIAL_WORKOUTS);
  const [nextId,setNextId]   = useState(6);

  /* profil */
  const [profile,setProfile] = useState({weight:"",height:"",age:"",fatPct:"",chest:"",waist:"",hip:"",quad:"",calf:"",arm:""});
  const [editProfile,setEditProfile] = useState(false);

  /* poids de corps */
  const [bodyweight,setBodyweight] = useState("");
  const [editBW,setEditBW] = useState(false);

  /* suppléments */
  const [supps,setSupps] = useState([
    {id:1,name:"Protéines",time:"08:00",done:false},
    {id:2,name:"Créatine",time:"12:00",done:false},
    {id:3,name:"Oméga 3",time:"20:00",done:false},
  ]);
  const [newSupp,setNewSupp] = useState({name:"",time:""});
  const [suppId,setSuppId]   = useState(4);

  /* planning */
  const [plan,setPlan] = useState({
    Lundi:    [{muscle:"Pectoraux",exercise:"Développé couché",sets:4,reps:10},{muscle:"Triceps",exercise:"Dips banc",sets:3,reps:12}],
    Mardi:    [{muscle:"Dos",exercise:"Tractions",sets:4,reps:8},{muscle:"Biceps",exercise:"Curl barre",sets:3,reps:10}],
    Mercredi: [],
    Jeudi:    [{muscle:"Jambes",exercise:"Squat",sets:4,reps:10},{muscle:"Fessiers",exercise:"Hip thrust",sets:3,reps:12}],
    Vendredi: [{muscle:"Épaules",exercise:"Développé militaire",sets:4,reps:10}],
    Samedi:   [],
    Dimanche: [],
  });
  const [planDay,setPlanDay] = useState("Lundi");
  const [planForm,setPlanForm] = useState({muscle:MUSCLE_GROUPS[0],exercise:EXERCISES[MUSCLE_GROUPS[0]][0],sets:3,reps:10});
  const [dayNames,setDayNames] = useState({Lundi:"Push",Mardi:"Pull",Jeudi:"Legs",Vendredi:"Épaules"});
  const [editDayName,setEditDayName] = useState(null);

  /* séance */
  const [formDate,setFormDate]   = useState(new Date().toISOString().split("T")[0]);
  const [formMuscle,setFormMuscle] = useState(MUSCLE_GROUPS[0]);
  const [formExercise,setFormExercise] = useState(EXERCISES[MUSCLE_GROUPS[0]][0]);
  const [formType,setFormType]   = useState("Normal");
  const [formSets,setFormSets]   = useState([{reps:"",weight:"",rest:""}]);
  const [prefillMode,setPrefillMode] = useState(null);
  const [lastSession,setLastSession] = useState(null);
  const [doneIdx,setDoneIdx]     = useState([]);
  const [timerSecs,setTimerSecs] = useState(null);
  const [timerKey,setTimerKey]   = useState(0);
  const [fromPlan,setFromPlan]   = useState(null);

  useEffect(()=>{
    const last=getLast(workouts,formExercise);
    setLastSession(last);setDoneIdx([]);
    if(last){
      const sug=suggest(last.sets);
      const ok=last.sets.every(s=>s.reps>=8);
      setPrefillMode(ok?"suggested":"last");
      setFormSets(sug.map(s=>({reps:String(s.reps),weight:String(s.weight),rest:String(s.rest)})));
    } else {
      setPrefillMode(null);
      setFormSets([{reps:"",weight:"",rest:""}]);
    }
  },[formExercise,workouts]);

  /* charts */
  const [chartEx,setChartEx] = useState("Développé couché");
  const allEx = useMemo(()=>[...new Set(workouts.map(w=>w.exercise))],[workouts]);
  const chartData = useMemo(()=>
    workouts.filter(w=>w.exercise===chartEx).sort((a,b)=>a.date.localeCompare(b.date))
      .map(w=>({date:fmtDate(w.date),"Charge max":calcMax(w.sets),"Volume":Math.round(calcVol(w.sets))})),
    [workouts,chartEx]);
  const volByMuscle = useMemo(()=>{
    const m={};
    workouts.forEach(w=>{m[w.muscle]=(m[w.muscle]||0)+calcVol(w.sets);});
    return Object.entries(m).map(([muscle,vol])=>({muscle,"Vol (kg)":Math.round(vol)}));
  },[workouts]);
  const weeklyVol = useMemo(()=>{
    const m={};
    Object.values(plan).flat().forEach(ex=>{m[ex.muscle]=(m[ex.muscle]||0)+ex.sets;});
    return m;
  },[plan]);

  /* handlers séance */
  const addSet    = ()=>setFormSets([...formSets,{reps:"",weight:"",rest:""}]);
  const removeSet = (i)=>setFormSets(formSets.filter((_,idx)=>idx!==i));
  const updSet    = (i,f,v)=>{const u=[...formSets];u[i]={...u[i],[f]:v};setFormSets(u);};
  const validateSet = (i)=>{
    if(!formSets[i].reps||!formSets[i].weight) return;
    setDoneIdx(p=>[...p,i]);
    setTimerSecs(Number(formSets[i].rest)||90);
    setTimerKey(k=>k+1);
  };
  const saveWorkout = ()=>{
    const valid=formSets.filter(s=>s.reps!==""&&s.weight!=="").map(s=>({reps:+s.reps,weight:+s.weight,rest:+s.rest||90}));
    if(!valid.length) return;
    setWorkouts([...workouts,{id:nextId,date:formDate,muscle:formMuscle,exercise:formExercise,type:formType,sets:valid}]);
    setNextId(nextId+1);
    setFormSets([{reps:"",weight:"",rest:""}]);
    setDoneIdx([]);setPrefillMode(null);setTimerSecs(null);setFromPlan(null);
    setView("log");
  };
  const startFromPlan = (day,ex)=>{
    setFormMuscle(ex.muscle);setFormExercise(ex.exercise);
    setFormType("Normal");setFormDate(new Date().toISOString().split("T")[0]);
    setFromPlan({day,ex});setView("new");
  };
  const sortedW = [...workouts].sort((a,b)=>b.date.localeCompare(a.date));
  const todayDay = DAYS[new Date().getDay()===0?6:new Date().getDay()-1];
  const todayPlan = plan[todayDay]||[];

  const NAV = [["log","📋"],["new","➕"],["plan","📅"],["charts","📈"],["supps","💊"],["profile","👤"]];

  return (
    <>
      <FontLink/>
      <div style={{minHeight:"100vh",background:"var(--cream)",fontFamily:"'Sora',sans-serif",color:"var(--text)",paddingBottom:90,maxWidth:500,margin:"0 auto"}}>

        {/* ── HEADER ── */}
        <div style={{background:"var(--white)",borderBottom:"1px solid var(--cream3)",padding:"18px 20px 14px",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(45,36,22,.06)"}}>
          <div style={{width:38,height:38,background:"linear-gradient(135deg,var(--coral),var(--coral2))",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 3px 10px rgba(232,113,74,.3)"}}>⚡</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:"var(--text)",letterSpacing:-.3}}>Iron Log</div>
            <div style={{fontSize:10,color:"var(--text3)",fontWeight:500,marginTop:-1}}>Carnet d'entraînement</div>
          </div>
          <div style={{marginLeft:"auto"}}>
            {editBW?(
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <input type="number" autoFocus placeholder="kg" value={bodyweight}
                  onChange={e=>setBodyweight(e.target.value)}
                  onBlur={()=>setEditBW(false)}
                  onKeyDown={e=>e.key==="Enter"&&setEditBW(false)}
                  style={{width:60,padding:"6px 9px",background:"var(--cream)",border:"1.5px solid var(--coral)",borderRadius:8,color:"var(--text)",fontSize:14,fontFamily:"'Sora',sans-serif",outline:"none",textAlign:"center"}}/>
                <span style={{fontSize:11,color:"var(--text3)"}}>kg</span>
              </div>
            ):(
              <button onClick={()=>setEditBW(true)} style={{background:bodyweight?"rgba(232,113,74,.08)":"var(--cream)",border:`1.5px solid ${bodyweight?"var(--coral)":"var(--cream3)"}`,borderRadius:10,padding:"5px 11px",cursor:"pointer",fontFamily:"'Sora',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                <span style={{fontSize:9,color:"var(--text3)",fontWeight:600}}>Poids corps</span>
                <span style={{fontSize:14,color:bodyweight?"var(--coral)":"var(--text3)",fontWeight:700}}>{bodyweight?`${bodyweight} kg`:"— kg"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ── TODAY WIDGETS (only on log) ── */}
        {view==="log" && (
          <div style={{padding:"14px 16px 0"}}>

            {/* Programme du jour */}
            {todayPlan.length>0&&(
              <div className="card fade-up" style={{padding:"12px 14px",marginBottom:10,borderLeft:`4px solid var(--coral)`}}>
                <div style={{fontSize:11,color:"var(--coral)",fontWeight:600,marginBottom:8}}>📅 Aujourd'hui — {dayNames[todayDay]||todayDay}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {todayPlan.map((ex,i)=>(
                    <button key={i} onClick={()=>startFromPlan(todayDay,ex)}
                      style={{fontSize:12,padding:"5px 11px",background:"var(--cream)",border:"1.5px solid var(--cream3)",borderRadius:8,color:"var(--text)",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontWeight:500}}>
                      {ex.exercise} <span style={{color:"var(--coral)",fontWeight:700}}>{ex.sets}×{ex.reps}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suppléments */}
            <div className="card fade-up" style={{padding:"11px 14px",marginBottom:10}}>
              <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginBottom:8}}>💊 Suppléments du jour</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {supps.map(s=>(
                  <button key={s.id} onClick={()=>setSupps(ss=>ss.map(x=>x.id===s.id?{...x,done:!x.done}:x))}
                    style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:s.done?"#f0f8f3":"var(--cream)",border:`1.5px solid ${s.done?"var(--sage2)":"var(--cream3)"}`,borderRadius:8,cursor:"pointer",fontFamily:"'Sora',sans-serif",color:s.done?"var(--sage)":"var(--text2)",fontSize:12,fontWeight:500}}>
                    <span>{s.done?"✓":"○"}</span>
                    <span>{s.name}</span>
                    <span style={{fontSize:10,color:s.done?"var(--sage)":"var(--text3)"}}>{s.time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NAV ── */}
        <div className="pill-nav" style={{display:"flex",background:"var(--white)",borderBottom:"1px solid var(--cream3)",position:"sticky",top:70,zIndex:99}}>
          {NAV.map(([k,ic])=>(
            <button key={k} className={view===k?"active":""} onClick={()=>setView(k)}>{ic}</button>
          ))}
        </div>

        {/* ════════════════════════════════
            LOG
        ════════════════════════════════ */}
        {view==="log" && (
          <div style={{padding:"14px 16px"}}>
            <div style={{fontSize:12,color:"var(--text3)",fontWeight:500,marginBottom:12}}>{workouts.length} séances enregistrées</div>
            {sortedW.map((w,wi)=>{
              const pr=isPR(w,workouts);
              const isBW=BODYWEIGHT_EXERCISES.has(w.exercise);
              const bw=Number(bodyweight)||0;
              const effSets=isBW&&bw?w.sets.map(s=>({...s,weight:s.weight+bw})):w.sets;
              const mc=muscleColor(w.muscle);
              const tc=TYPE_COLORS[w.type]||TYPE_COLORS["Normal"];
              return (
                <div key={w.id} className="card fade-up" style={{marginBottom:10,overflow:"hidden",animationDelay:`${wi*.04}s`,borderLeft:`4px solid ${mc}`}}>
                  <div style={{padding:"10px 14px 8px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
                        <span className="tag" style={{background:mc+"18",color:mc}}>{w.muscle}</span>
                        {w.type!=="Normal"&&<span className="tag" style={{background:tc+"18",color:tc}}>{w.type}</span>}
                        {pr&&<span className="tag" style={{background:"linear-gradient(135deg,#f0c060,#e8a030)",color:"#fff"}}>🏆 PR</span>}
                      </div>
                      <div style={{fontSize:15,fontWeight:600,color:"var(--text)"}}>{w.exercise}</div>
                    </div>
                    <span style={{fontSize:12,color:"var(--text3)",fontWeight:500,flexShrink:0,marginTop:2}}>{fmtDate(w.date)}</span>
                  </div>
                  <div style={{padding:"0 14px 12px"}}>
                    {isBW&&bw>0&&(
                      <div style={{fontSize:11,color:"var(--lavender)",fontWeight:500,marginBottom:6,background:"rgba(155,133,196,.08)",borderRadius:6,padding:"3px 8px",display:"inline-block"}}>
                        🏋️ Poids de corps : {bw} kg
                      </div>
                    )}
                    <div style={{display:"flex",gap:6,marginBottom:5}}>
                      {["#","Reps",isBW?"Lest":"Kg","Récup"].map(h=>(
                        <div key={h} style={{flex:1,fontSize:10,color:"var(--text3)",fontWeight:600,textAlign:"center"}}>{h}</div>
                      ))}
                    </div>
                    {w.sets.map((s,i)=>(
                      <div key={i} style={{display:"flex",gap:6,marginBottom:3,background:i%2===0?"transparent":"var(--cream)",borderRadius:6,padding:"4px 0"}}>
                        <div style={{flex:1,fontSize:12,textAlign:"center",color:mc,fontWeight:700}}>{i+1}</div>
                        <div style={{flex:1,fontSize:13,textAlign:"center",fontWeight:500}}>{s.reps}</div>
                        <div style={{flex:1,fontSize:13,textAlign:"center",fontWeight:600,color:isBW?"var(--lavender)":"var(--gold)"}}>
                          {isBW?(s.weight>0?`+${s.weight}`:"PC"):s.weight}
                        </div>
                        <div style={{flex:1,fontSize:12,textAlign:"center",color:"var(--text3)"}}>{s.rest}s</div>
                      </div>
                    ))}
                    <div style={{marginTop:9,paddingTop:8,borderTop:"1px solid var(--cream2)",display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:12,color:"var(--text3)",fontWeight:500}}>
                        Volume <span style={{color:"var(--sage)",fontWeight:700}}>{Math.round(calcVol(effSets))} kg</span>
                      </span>
                      <span style={{fontSize:12,color:"var(--text3)",fontWeight:500}}>
                        Max <span style={{color:pr?"var(--gold)":"var(--coral)",fontWeight:700}}>
                          {isBW&&bw?`${bw+calcMax(w.sets)} kg`:`${calcMax(w.sets)} kg`}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════
            NOUVELLE SÉANCE
        ════════════════════════════════ */}
        {view==="new" && (
          <div style={{padding:"14px 16px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:16}}>
              {fromPlan?`Séance — ${fromPlan.day}`:"Nouvelle séance"}
            </div>

            <label style={lbl}>Date</label>
            <input type="date" value={formDate} onChange={e=>setFormDate(e.target.value)} style={inp}/>

            <label style={lbl}>Groupe musculaire</label>
            <select value={formMuscle} onChange={e=>{setFormMuscle(e.target.value);setFormExercise(EXERCISES[e.target.value][0]);}} style={inp}>
              {MUSCLE_GROUPS.map(m=><option key={m}>{m}</option>)}
            </select>

            <label style={lbl}>Exercice</label>
            <select value={formExercise} onChange={e=>setFormExercise(e.target.value)} style={inp}>
              {EXERCISES[formMuscle].map(ex=><option key={ex}>{ex}</option>)}
            </select>

            <label style={lbl}>Type d'entraînement</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {TRAINING_TYPES.map(t=>{
                const tc=TYPE_COLORS[t];
                const sel=formType===t;
                return (
                  <button key={t} className="type-pill" onClick={()=>setFormType(t)}
                    style={{borderColor:sel?tc:"var(--cream3)",background:sel?tc+"18":"var(--white)",color:sel?tc:"var(--text2)",fontFamily:"'Sora',sans-serif"}}>
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Prefill banner */}
            {lastSession&&(
              <div className="card" style={{padding:"11px 13px",marginBottom:12,borderLeft:`3px solid ${prefillMode==="suggested"?"var(--sage)":"var(--gold)"}`}}>
                <div style={{fontSize:12,fontWeight:600,color:prefillMode==="suggested"?"var(--sage)":"var(--gold)",marginBottom:3}}>
                  {prefillMode==="suggested"?"🚀 Progression suggérée +2.5 kg":"📋 Dernière séance"}
                </div>
                <div style={{fontSize:12,color:"var(--text3)",marginBottom:8}}>
                  {fmtDate(lastSession.date)} — {lastSession.sets.map(s=>`${s.weight}kg×${s.reps}`).join(" · ")}
                </div>
                <div style={{display:"flex",gap:8}}>
                  {[["last","Mêmes charges"],["suggested","+2.5 kg"]].map(([mode,label])=>(
                    <button key={mode} onClick={()=>{
                      const sets=mode==="suggested"?suggest(lastSession.sets):lastSession.sets;
                      setFormSets(sets.map(x=>({reps:String(x.reps),weight:String(x.weight),rest:String(x.rest)})));
                      setPrefillMode(mode);
                    }} style={{padding:"5px 12px",fontSize:12,background:prefillMode===mode?(mode==="suggested"?"var(--sage)":"var(--gold)"):"var(--cream)",color:prefillMode===mode?"#fff":"var(--text2)",border:`1px solid ${prefillMode===mode?(mode==="suggested"?"var(--sage)":"var(--gold)"):"var(--cream3)"}`,borderRadius:8,cursor:"pointer",fontFamily:"'Sora',sans-serif",fontWeight:600}}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PDC info */}
            {BODYWEIGHT_EXERCISES.has(formExercise)&&(
              <div style={{marginBottom:10,padding:"9px 13px",background:"rgba(155,133,196,.08)",border:"1px solid rgba(155,133,196,.2)",borderRadius:10,fontSize:12,color:"var(--lavender)",fontWeight:500}}>
                🏋️ {bodyweight?`Poids de corps : ${bodyweight} kg — entre le lest ajouté (0 = sans lest)`:"Renseigne ton poids de corps en haut"}
              </div>
            )}

            {/* Sets */}
            <label style={lbl}>Séries</label>
            <div style={{display:"flex",gap:8,marginBottom:7,paddingLeft:36}}>
              {["Reps",BODYWEIGHT_EXERCISES.has(formExercise)?"Lest":"Kg","Récup"].map(h=>(
                <div key={h} style={{flex:1,fontSize:11,color:"var(--text3)",fontWeight:600,textAlign:"center"}}>{h}</div>
              ))}
              <div style={{width:44}}/>
            </div>
            {formSets.map((s,i)=>{
              const done=doneIdx.includes(i);
              return (
                <div key={i} className="set-row" style={{opacity:done?.45:1,transition:"opacity .3s"}}>
                  <div style={{width:28,height:28,borderRadius:8,background:done?"var(--sage)":"var(--coral)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:done?14:12,fontWeight:700,flexShrink:0}}>
                    {done?"✓":i+1}
                  </div>
                  {["reps","weight","rest"].map(f=>(
                    <input key={f} type="number" placeholder={f==="rest"?"90":"—"} value={s[f]} disabled={done}
                      onChange={e=>updSet(i,f,e.target.value)}
                      style={{...inp,margin:0,textAlign:"center",padding:"10px 4px",flex:1,opacity:done?.5:1}}/>
                  ))}
                  {done?(
                    <div style={{width:44,textAlign:"center",color:"var(--sage)",fontSize:18}}>✓</div>
                  ):(
                    <button onClick={()=>validateSet(i)}
                      style={{width:44,height:42,background:"linear-gradient(135deg,var(--sage),#5a8e6e)",border:"none",color:"#fff",borderRadius:10,cursor:"pointer",fontSize:16,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      ▶
                    </button>
                  )}
                </div>
              );
            })}
            <div style={{fontSize:11,color:"var(--text3)",textAlign:"center",marginBottom:8,fontWeight:500}}>
              Appuie sur ▶ après chaque série pour lancer le timer
            </div>
            <button onClick={addSet} style={{width:"100%",padding:"10px",background:"transparent",border:"1.5px dashed var(--cream3)",color:"var(--text3)",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:500,marginBottom:14,fontFamily:"'Sora',sans-serif"}}>
              + Ajouter une série
            </button>
            <button onClick={saveWorkout} className="btn-coral">💾 Enregistrer la séance</button>
          </div>
        )}

        {/* ════════════════════════════════
            PLANNING
        ════════════════════════════════ */}
        {view==="plan" && (
          <div style={{padding:"14px 16px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:14}}>Planning hebdo</div>

            {/* Volume par muscle */}
            <div className="card" style={{padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginBottom:10}}>Volume par muscle (séries/sem.)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {Object.entries(weeklyVol).map(([m,v])=>{
                  const mc=muscleColor(m);
                  return (
                    <div key={m} style={{padding:"4px 10px",background:mc+"14",border:`1px solid ${mc}30`,borderRadius:8}}>
                      <span style={{fontSize:11,color:"var(--text2)",fontWeight:500}}>{m}</span>
                      <span style={{fontSize:15,color:mc,fontWeight:700,marginLeft:6}}>{v}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Jours */}
            <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
              {DAYS.map(d=>(
                <button key={d} className={`day-btn ${planDay===d?"active":""}`} onClick={()=>setPlanDay(d)}>
                  {d.slice(0,3)}
                </button>
              ))}
            </div>

            {/* Nom du jour */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              {editDayName===planDay?(
                <input autoFocus placeholder="Ex: Push, Pull, Legs..." value={dayNames[planDay]||""}
                  onChange={e=>setDayNames(p=>({...p,[planDay]:e.target.value}))}
                  onBlur={()=>setEditDayName(null)}
                  onKeyDown={e=>e.key==="Enter"&&setEditDayName(null)}
                  style={{...inp,margin:0,fontSize:14,flex:1}}/>
              ):(
                <button onClick={()=>setEditDayName(planDay)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"var(--text)",padding:0,display:"flex",alignItems:"center",gap:6}}>
                  {dayNames[planDay]||planDay}
                  {dayNames[planDay]&&<span style={{fontFamily:"'Sora',sans-serif",fontSize:12,color:"var(--text3)",fontWeight:500}}>({planDay})</span>}
                  <span style={{fontSize:13,color:"var(--text3)"}}>✏️</span>
                </button>
              )}
            </div>

            {/* Exercices */}
            {plan[planDay].length===0?(
              <div style={{textAlign:"center",padding:"28px 0",color:"var(--text3)",fontSize:13,border:"1.5px dashed var(--cream3)",borderRadius:12,marginBottom:14}}>
                Repos 😴 ou à planifier
              </div>
            ):(
              plan[planDay].map((ex,i)=>{
                const mc=muscleColor(ex.muscle);
                return (
                  <div key={i} className="card" style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",marginBottom:8,borderLeft:`3px solid ${mc}`}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:mc,fontWeight:600,marginBottom:2}}>{ex.muscle}</div>
                      <div style={{fontSize:14,color:"var(--text)",fontWeight:500}}>{ex.exercise}</div>
                      <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>{ex.sets} séries × {ex.reps} reps</div>
                    </div>
                    <button onClick={()=>startFromPlan(planDay,ex)} style={{padding:"6px 10px",background:"rgba(232,113,74,.1)",border:"1px solid var(--coral)",borderRadius:8,color:"var(--coral)",cursor:"pointer",fontSize:12,fontFamily:"'Sora',sans-serif",fontWeight:600}}>▶</button>
                    <button onClick={()=>setPlan(p=>({...p,[planDay]:p[planDay].filter((_,idx)=>idx!==i)}))} style={{width:28,height:28,background:"var(--cream)",border:"none",color:"var(--text3)",borderRadius:7,cursor:"pointer",fontSize:15}}>×</button>
                  </div>
                );
              })
            )}

            {/* Add form */}
            <div style={{background:"var(--cream2)",border:"1.5px dashed var(--sand)",borderRadius:12,padding:"13px"}}>
              <div style={{fontSize:12,color:"var(--text3)",fontWeight:600,marginBottom:10}}>+ Ajouter un exercice</div>
              <select value={planForm.muscle} onChange={e=>setPlanForm(p=>({...p,muscle:e.target.value,exercise:EXERCISES[e.target.value][0]}))} style={{...inp,background:"var(--white)",marginBottom:7}}>
                {MUSCLE_GROUPS.map(m=><option key={m}>{m}</option>)}
              </select>
              <select value={planForm.exercise} onChange={e=>setPlanForm(p=>({...p,exercise:e.target.value}))} style={{...inp,background:"var(--white)",marginBottom:7}}>
                {EXERCISES[planForm.muscle].map(ex=><option key={ex}>{ex}</option>)}
              </select>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                {[["sets","Séries"],["reps","Reps cible"]].map(([k,l])=>(
                  <div key={k} style={{flex:1}}>
                    <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginBottom:4}}>{l}</div>
                    <input type="number" value={planForm[k]} onChange={e=>setPlanForm(p=>({...p,[k]:+e.target.value}))}
                      style={{...inp,margin:0,textAlign:"center",background:"var(--white)"}}/>
                  </div>
                ))}
              </div>
              <button onClick={()=>setPlan(p=>({...p,[planDay]:[...p[planDay],{...planForm}]}))}
                className="btn-coral" style={{padding:"11px"}}>Ajouter</button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            GRAPHIQUES
        ════════════════════════════════ */}
        {view==="charts" && (
          <div style={{padding:"14px 16px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:14}}>Statistiques</div>
            <div className="card" style={{padding:"14px",marginBottom:14}}>
              <div style={{fontSize:12,color:"var(--text3)",fontWeight:600,marginBottom:10}}>Progression par exercice</div>
              <select value={chartEx} onChange={e=>setChartEx(e.target.value)} style={{...inp,marginBottom:14,background:"var(--cream)"}}>
                {allEx.map(ex=><option key={ex}>{ex}</option>)}
              </select>
              {chartData.length>1?(
                <>
                  <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginBottom:6}}>Charge max (kg)</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--cream3)"/><XAxis dataKey="date" stroke="var(--text3)" tick={{fontSize:11,fill:"var(--text3)"}}/><YAxis stroke="var(--text3)" tick={{fontSize:11,fill:"var(--text3)"}}/><Tooltip contentStyle={{background:"var(--white)",border:"1px solid var(--cream3)",borderRadius:10,fontSize:12,color:"var(--text)"}} labelStyle={{color:"var(--text2)"}}/><Line type="monotone" dataKey="Charge max" stroke="var(--coral)" strokeWidth={2.5} dot={{fill:"var(--coral)",r:4}}/></LineChart>
                  </ResponsiveContainer>
                  <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginBottom:6,marginTop:16}}>Volume total (kg)</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--cream3)"/><XAxis dataKey="date" stroke="var(--text3)" tick={{fontSize:11,fill:"var(--text3)"}}/><YAxis stroke="var(--text3)" tick={{fontSize:11,fill:"var(--text3)"}}/><Tooltip contentStyle={{background:"var(--white)",border:"1px solid var(--cream3)",borderRadius:10,fontSize:12}} labelStyle={{color:"var(--text2)"}}/><Line type="monotone" dataKey="Volume" stroke="var(--sage)" strokeWidth={2.5} dot={{fill:"var(--sage)",r:4}}/></LineChart>
                  </ResponsiveContainer>
                </>
              ):(
                <div style={{textAlign:"center",padding:"32px 0",color:"var(--text3)",fontSize:13,border:"1.5px dashed var(--cream3)",borderRadius:10}}>
                  Enregistre au moins 2 séances<br/>pour voir l'évolution 📈
                </div>
              )}
            </div>
            <div className="card" style={{padding:"14px"}}>
              <div style={{fontSize:12,color:"var(--text3)",fontWeight:600,marginBottom:12}}>Volume total par muscle</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={volByMuscle} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--cream3)"/>
                  <XAxis type="number" stroke="var(--text3)" tick={{fontSize:10,fill:"var(--text3)"}}/>
                  <YAxis type="category" dataKey="muscle" stroke="var(--text3)" tick={{fontSize:11,fill:"var(--text2)"}} width={80}/>
                  <Tooltip contentStyle={{background:"var(--white)",border:"1px solid var(--cream3)",borderRadius:10,fontSize:12}}/>
                  <Bar dataKey="Vol (kg)" fill="var(--coral)" radius={[0,6,6,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            SUPPLÉMENTS
        ════════════════════════════════ */}
        {view==="supps" && (
          <div style={{padding:"14px 16px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:14}}>Compléments alimentaires</div>
            {supps.map(s=>(
              <div key={s.id} className={`supp-item ${s.done?"done":""}`}>
                <button onClick={()=>setSupps(ss=>ss.map(x=>x.id===s.id?{...x,done:!x.done}:x))}
                  style={{width:30,height:30,borderRadius:9,background:s.done?"var(--sage)":"var(--cream)",border:`2px solid ${s.done?"var(--sage)":"var(--cream3)"}`,color:"#fff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
                  {s.done?"✓":""}
                </button>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,color:s.done?"var(--sage)":"var(--text)",fontWeight:500,textDecoration:s.done?"line-through":"none"}}>{s.name}</div>
                  <div style={{fontSize:11,color:"var(--text3)",marginTop:1}}>🕐 {s.time}</div>
                </div>
                <button onClick={()=>setSupps(ss=>ss.filter(x=>x.id!==s.id))} style={{width:28,height:28,background:"transparent",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:16}}>×</button>
              </div>
            ))}
            <div style={{marginTop:18,background:"var(--cream2)",border:"1.5px dashed var(--sand)",borderRadius:12,padding:"13px"}}>
              <div style={{fontSize:12,color:"var(--text3)",fontWeight:600,marginBottom:10}}>+ Nouveau complément</div>
              <input placeholder="Nom (ex: Vitamine D)" value={newSupp.name} onChange={e=>setNewSupp(p=>({...p,name:e.target.value}))} style={{...inp,background:"var(--white)"}}/>
              <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginBottom:5,marginTop:8}}>Heure de prise</div>
              <input type="time" value={newSupp.time} onChange={e=>setNewSupp(p=>({...p,time:e.target.value}))} style={{...inp,background:"var(--white)",marginBottom:12}}/>
              <button onClick={()=>{
                if(!newSupp.name) return;
                setSupps(s=>[...s,{id:suppId,name:newSupp.name,time:newSupp.time||"—",done:false}]);
                setSuppId(n=>n+1);setNewSupp({name:"",time:""});
              }} className="btn-coral" style={{padding:"11px"}}>Ajouter</button>
            </div>
            <button onClick={()=>setSupps(s=>s.map(x=>({...x,done:false})))} style={{width:"100%",marginTop:10,padding:"10px",background:"var(--white)",border:"1.5px solid var(--cream3)",borderRadius:10,color:"var(--text3)",cursor:"pointer",fontSize:12,fontFamily:"'Sora',sans-serif",fontWeight:500}}>
              ↺ Réinitialiser le jour
            </button>
          </div>
        )}

        {/* ════════════════════════════════
            PROFIL
        ════════════════════════════════ */}
        {view==="profile" && (
          <div style={{padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--text)"}}>Mon profil</div>
              <button onClick={()=>setEditProfile(e=>!e)} style={{padding:"6px 14px",background:editProfile?"var(--sage)":"var(--cream)",border:`1.5px solid ${editProfile?"var(--sage)":"var(--cream3)"}`,borderRadius:9,color:editProfile?"#fff":"var(--text2)",cursor:"pointer",fontSize:12,fontFamily:"'Sora',sans-serif",fontWeight:600}}>
                {editProfile?"✓ Sauver":"✏️ Modifier"}
              </button>
            </div>

            {/* Stats rapides */}
            {profile.weight&&profile.height&&(
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {[
                  ["IMC",bmiCalc(profile.weight,profile.height),Number(bmiCalc(profile.weight,profile.height))<18.5?"var(--lavender)":Number(bmiCalc(profile.weight,profile.height))<25?"var(--sage)":Number(bmiCalc(profile.weight,profile.height))<30?"var(--gold)":"var(--coral)"],
                  ["Poids",`${profile.weight} kg`,"var(--coral)"],
                  ["Taille",`${profile.height} cm`,"var(--sky)"],
                ].map(([k,v,c])=>(
                  <div key={k} className="card" style={{flex:1,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:"var(--text3)",fontWeight:600,marginBottom:3}}>{k}</div>
                    <div style={{fontSize:19,color:c,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>{v||"—"}</div>
                  </div>
                ))}
              </div>
            )}

            {[
              {section:"Mesures de base",fields:[
                {key:"weight",label:"Poids (kg)",type:"number"},
                {key:"height",label:"Taille (cm)",type:"number"},
                {key:"age",label:"Âge",type:"number"},
                {key:"fatPct",label:"Masse grasse (%)",type:"number"},
              ]},
              {section:"Mensurations",fields:[
                {key:"chest",label:"Poitrine (cm)"},
                {key:"waist",label:"Tour de taille (cm)"},
                {key:"hip",label:"Tour de hanche (cm)"},
                {key:"quad",label:"Quadriceps (cm)"},
                {key:"calf",label:"Mollet (cm)"},
                {key:"arm",label:"Bras (cm)"},
              ]},
            ].map(({section,fields})=>(
              <div key={section} className="card" style={{padding:"14px",marginBottom:12}}>
                <div style={{fontSize:12,color:"var(--text3)",fontWeight:600,marginBottom:12,paddingBottom:8,borderBottom:"1px solid var(--cream2)"}}>{section}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                  {fields.map(({key,label,type})=>(
                    <div key={key} className="profile-field">
                      <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,marginBottom:4}}>{label}</div>
                      {editProfile?(
                        <input type={type||"number"} value={profile[key]} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))}
                          style={{...inp,margin:0,padding:"10px 12px",fontSize:14}}/>
                      ):(
                        <div className="profile-val">{profile[key]||<span style={{color:"var(--cream3)"}}>—</span>}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {profile.weight&&profile.fatPct&&(
              <div className="card" style={{padding:"14px"}}>
                <div style={{fontSize:12,color:"var(--text3)",fontWeight:600,marginBottom:10}}>Composition corporelle estimée</div>
                <div style={{display:"flex",gap:10}}>
                  {[
                    ["Masse grasse",`${(profile.weight*profile.fatPct/100).toFixed(1)} kg`,"var(--coral)"],
                    ["Masse maigre",`${(profile.weight*(1-profile.fatPct/100)).toFixed(1)} kg`,"var(--sage)"],
                  ].map(([k,v,c])=>(
                    <div key={k} style={{flex:1,textAlign:"center",background:"var(--cream)",borderRadius:10,padding:"10px 6px"}}>
                      <div style={{fontSize:10,color:"var(--text3)",fontWeight:600,marginBottom:3}}>{k.toUpperCase()}</div>
                      <div style={{fontSize:18,color:c,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timer */}
        {timerSecs!==null&&<RestTimer key={timerKey} seconds={timerSecs} onClose={()=>setTimerSecs(null)}/>}
      </div>
    </>
  );
}
