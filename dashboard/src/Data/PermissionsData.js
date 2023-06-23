 import {
  RemoveCircleOutline,
  CallMissedOutgoingOutlined,
  CompareArrows,
  DeleteSweep,
  Flag,
  MessageOutlined, 
  Mic, 
  PanTool,
  Person,
  RemoveCircle,
  Settings,
} from "@mui/icons-material";

 const permisstionsData = [
    {id: '1', label: "حظر جهاز", key: "block_device", icon: <RemoveCircle/>, member: false, admin: true, super_admin: true, master: true} ,
    {id: '2', label: "طرد", key: "kick_out", icon: <CallMissedOutgoingOutlined/>, member: false, admin: true, super_admin: true, master: true} ,
    {id: '3', label: "ايقاف", key: "stop", icon: <PanTool/>, member: false, admin: true, super_admin: true, master: true} ,
    {id: '4', label: "دور المايك", key: "mic", icon: <Mic/>, member: false, admin: true, super_admin: true, master: true} ,
    {id: '5', label: "رسائل عامة", key: "public_msg", icon: <MessageOutlined/>, member: false, admin: true, super_admin: true, master: true} ,
    {id: '6', label: "حذف الرسائل", key: "remove_msgs", icon: <DeleteSweep/>, member: false, admin: true, super_admin: true, master: true} ,
    {id: '7', label: "إلغاء الحظر", key: "remove_block", icon: <RemoveCircleOutline/>, member: false, admin: true, super_admin: true, master: true} ,
    {id: '8', label: "سجل الغرفة", key: "logout_history", icon: <CompareArrows/>, member: false, admin: true, super_admin: true, master: true} ,
    {id: '9', label: "ادارة المستخدمين", key: "users_control", icon: <Person style={{color: "black"}}/>, member: false, admin: false, super_admin: true, master: true},
    {id: '10', label: "ادارة الأعضاء", key: "member_control", icon: <Person style={{color: "purple"}}/>, member: false, admin: false, super_admin: true, master: true} ,
    {id: '11', label: "ادارة الأدمن", key: "admin_control", icon: <Person style={{color: "blue"}}/>, member: false, admin: false, super_admin: true, master: true} ,
    {id: '12', label: "ادارة السوبر أدمن" , key: "super_admin", icon: <Person style={{color: "green"}}/>, member: false, admin: false, super_admin: false, master: true} ,
    {id: '13', label: "ادارة الماستر" , key: "master_control", icon: <Person style={{color: "red"}}/>, member: false, admin: false, super_admin: false, master: true} ,
    {id: '14', label: "اعدادات الغرفة" , key: "room_settings", icon: <Settings/>,  member: false, admin: false, super_admin: false, master: true},
   { id: '15', label: "التقارير" , key: "reports", icon: <Flag/>,  member: false, admin: false, super_admin: false, master: true} ,
]; 
export default permisstionsData;