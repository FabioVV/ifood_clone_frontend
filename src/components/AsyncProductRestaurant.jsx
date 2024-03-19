import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { getCurrentUserToken } from '../utils/UserlocalStorage';


export default function AsynchronousRestaurants({fn_set_id, fn_object}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

  
    useEffect(() => {
      let active = true;
  
      if (!loading) {
        return undefined;
      }
  
      (async () => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/v1/restaurants/user-available-restaurants/`, {
                method:'GET',
    
                headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
    
            })
    
            if(response.ok){
                const data = await response.json()

                if (active) {
                    setOptions([...data]);
                }
            } 
        } catch(e) {
            console.log(e)
            return false
        }
        
      })();
  
      return () => {
        active = false;
      };
    }, [loading]);

    // CASO QUERIA FAZER A REQUISIÇÃO DE GET RESTAURANTES A CADA VEZ QUE ABRE O INPUT, DESCOMENTAR ISSO AQUI

    // useEffect(() => {
    //   if (!open) {
    //     setOptions([]);
    //   }
    // }, [open]);


  
    return (
      <Autocomplete
    
        id="restaurant_id"
        sx={{ width: '100%' }}
        onChange={(event, value) => {fn_set_id({...fn_object, restaurant_id:value.id})}}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Nome do restaurante"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    );
}
