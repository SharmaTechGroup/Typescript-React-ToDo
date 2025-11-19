
export function Navbar(props:any){
    return(
        <nav>
            {props.title}
            {
                props.items.map((item:any)=> <span key={item}>{item}</span>)
            }
        </nav>
    )    
}