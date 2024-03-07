export function show_flash_message(fn_state){
    
    window.scrollTo({top: 0, behavior: 'smooth'});
    fn_state(true)

    const TIME = 5000
    setTimeout(()=>{
        
        fn_state(false)

    }, TIME)

}