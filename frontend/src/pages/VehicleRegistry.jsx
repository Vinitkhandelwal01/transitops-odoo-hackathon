import {useEffect,useState} from "react";
import {Plus, Pencil, Trash2} from "lucide-react";
import api from "../services/api";
import AddVehicleModal from "../components/AddVehicleModal";

export default function VehicleRegistry(){
 const [vehicles,setVehicles]=useState([]),[search,setSearch]=useState(""),[type,setType]=useState(""),[status,setStatus]=useState("");
 const [modal,setModal]=useState(false),[editing,setEditing]=useState(null);
 const load=async()=>{const {data}=await api.get("/vehicles",{params:{search,type,status}});setVehicles(data)};
 useEffect(()=>{load()},[search,type,status]);
 const save=async form=>{editing?await api.put(`/vehicles/${editing._id}`,form):await api.post("/vehicles",form);setModal(false);setEditing(null);load()};
 const remove=async v=>{if(confirm(`Delete ${v.registrationNumber}?`)){try{await api.delete(`/vehicles/${v._id}`);load()}catch(e){alert(e.response?.data?.message)} }};
 const money=n=>new Intl.NumberFormat("en-IN").format(n);
 return <main className="content">
   <div className="topbar"><input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/><div className="user">Raven K. <b>Dispatcher</b><span>RK</span></div></div>
   <section className="registry">
    <div className="filters">
      <select value={type} onChange={e=>setType(e.target.value)}><option value="">Type: All</option>{["Van","Truck","Mini","Bus","Car","Other"].map(x=><option key={x}>{x}</option>)}</select>
      <select value={status} onChange={e=>setStatus(e.target.value)}><option value="">Status: All</option>{["Available","On Trip","In Shop","Retired"].map(x=><option key={x}>{x}</option>)}</select>
      <input placeholder="Search reg. no..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <button className="add" onClick={()=>{setEditing(null);setModal(true)}}><Plus size={17}/> Add Vehicle</button>
    </div>
    <table><thead><tr><th>REG. NO. / UNIQUE</th><th>NAME/MODEL</th><th>TYPE</th><th>CAPACITY</th><th>ODOMETER</th><th>ACQ. COST</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
    <tbody>{vehicles.map(v=><tr key={v._id}><td>{v.registrationNumber}</td><td>{v.name}</td><td>{v.type}</td><td>{v.capacity} kg</td><td>{money(v.odometer)}</td><td>₹{money(v.acquisitionCost)}</td><td><span className={`badge ${v.status.replaceAll(" ","").toLowerCase()}`}>{v.status}</span></td><td><button className="icon" onClick={()=>{setEditing(v);setModal(true)}}><Pencil size={16}/></button><button className="icon danger" onClick={()=>remove(v)}><Trash2 size={16}/></button></td></tr>)}</tbody></table>
    <p className="rule">Rule: Registration No. must be unique • Retired/In Shop vehicles are hidden from Trip Dispatcher</p>
   </section>
   {modal&&<AddVehicleModal editing={editing} onClose={()=>{setModal(false);setEditing(null)}} onSave={save}/>}
 </main>
}
