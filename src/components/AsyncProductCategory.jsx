import {useState, useEffect} from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { getCurrentUserToken } from '../utils/UserlocalStorage';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



export default function AsynchronousProductCategories({fn_set_id, fn_object, is_update = false}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

    const[CategoriesList, setCategoriesList] = useState([]);


    useEffect(() => {
        let active = true;
    
        if (!loading) {
          return undefined;
        }
    
        (async () => {
          try{
              const response = await fetch(`http://127.0.0.1:8000/api/v1/categories/available-categories/`, {
                  method:'GET',
      
                  headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
      
              })
      
              if(response.ok){
                  const data = await response.json()
                  console.log(data)
  
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




    useEffect(()=>{
        fn_set_id({...fn_object, categories:CategoriesList})
    }, [CategoriesList.length])


    // CASO QUERIA FAZER A REQUISIÇÃO DE GET CATEGORIAS A CADA VEZ QUE ABRE O INPUT, DESCOMENTAR ISSO AQUI
    // useEffect(() => {
    //     if (!open) {
    //       setOptions([]);
    //     }
    //   }, [open]);

    return (
        is_update ?
        <Autocomplete
            multiple

            sx={{ width: '100%' }}
            id="categories"
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            options={options}
            loading={loading}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={(e, v) => {setCategoriesList([...v])}}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={[...fn_object.categories]}

            renderOption={(props, option, { selected }) => (
                <li {...props}>
                <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    value={option.id}
                />
                {option.name}
                </li>
            )}
            renderInput={(params) => (
                <TextField {...params} label="Selecione as categorias do produto" placeholder="Categorias" />
            )}
        />
        :
        <Autocomplete
            multiple

            sx={{ width: '100%' }}
            id="categories"
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            options={options}
            loading={loading}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={(e, v) => {setCategoriesList([...v])}}
            isOptionEqualToValue={(option, value) => option.id === value.id}

            renderOption={(props, option, { selected }) => (
                <li {...props}>
                <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    value={option.id}
                />
                {option.name}
                </li>
            )}
            renderInput={(params) => (
                <TextField {...params} label="Selecione as categorias do produto" placeholder="Categorias" />
            )}
        />
    );
}


