import "./ButtonIcon.css";
function ButtonIcon({onClick=()=>{},src=null,alt=null}){
    return(
      <div className='icon_container' onClick={(e)=>{onClick(e)}}><img src={src} alt={alt} className='icon_img'/></div>
    )
}

export default ButtonIcon;