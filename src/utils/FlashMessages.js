export function show_flash_message(fn_state, Object, message, type){
    
    window.scrollTo({top: 0, behavior: 'smooth'});
    
    fn_state({ ...Object,
        show:true,
        message:message,
        type:type,
    })

    const TIME = 5000
    setTimeout(()=>{
        
        fn_state({ ...Object,
            show:false,
        })

    }, TIME)

}