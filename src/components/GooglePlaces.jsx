import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import Alert from './Alert';
import { show_flash_message } from '../utils/FlashMessages';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;


function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };


export default function GooglePlaces({user_geolocation_fn}) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);


  const [ShowAlert, setShowAlert] = React.useState({
    show: false,
    message:'',
    type:'',
  })

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    [],
  );


  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    const requestOptions = {
        input: inputValue,
        componentRestrictions: { country: 'BR' }
    };

    fetch(requestOptions, (results) => {
        if (active) {
        let newOptions = [];

        if (value) {
            newOptions = [value];
        }

        if (results) {
            newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
        }
    });


    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <>
      {ShowAlert?.show ? <Alert message={`${ShowAlert?.message}`} type={`${ShowAlert?.type}`}/>: ""}

      <Autocomplete
        disablePortal
        id="google-map-autocomplete"
        sx={{ width: `100%`}}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.description
        }
        filterOptions={(x) => x}
        options={options}
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="Sem localização"
        onChange={async (event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);

            try{
              console.log(inputValue)
              const results = await getGeocode({ address: inputValue })
              const {lat, lng} =  getLatLng(results[0])

              let _results = results[0]

              let user_address = {
                street:'',
                neighborhood:'',
                number:'',
                city:'',
                state:'',
                zip_code:'',
            }

              for(let obj of _results['address_components']){
                for(let type_obj of obj['types']){
    
                    if(type_obj == 'street_number'){
                        user_address.number = obj['long_name']
    
                    }
    
                    if(type_obj == 'route'){
                        user_address.street = obj['long_name']
    
                    }
    
                    if(type_obj == 'sublocality'){
                        user_address.neighborhood = obj['long_name']
    
                    }
    
                    if(type_obj == 'administrative_area_level_2'){
                        user_address.city = obj['long_name']
    
                    }
    
                    if(type_obj == 'administrative_area_level_1'){
                        user_address.state = obj['short_name']
    
                    }
    
                    if(type_obj == 'postal_code'){
                        user_address.zip_code = obj['long_name']
    
                    }
                }
            }
            let blank_fields = 0

            Object.entries(user_address).forEach(([key, val]) => {
                if(val == '' || val == undefined || val == null){

                  show_flash_message(setShowAlert, ShowAlert, `Favor, Insira um endereço completo.`, 'alert-error')
                  blank_fields++
                } 
            });

            if(blank_fields == 0){
              user_geolocation_fn({
                lat:lat,
                lng:lng,
                location:inputValue,
                result:results[0],
              })
  
            }

            

            } catch(e){

              console.log(e.message)
            }
          

        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Digite uma localização" fullWidth />
        )}
        renderOption={(props, option) => {
          const matches =
            option.structured_formatting.main_text_matched_substrings || [];

          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match) => [match.offset, match.offset + match.length]),
          );

          return (
            <li   {...props}>
              <Grid container alignItems="center">
                <Grid item sx={{ display: 'flex', width: 44 }}>
                  <LocationOnIcon sx={{ color: 'text.secondary' }} />
                </Grid>
                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                  {parts.map((part, index) => (
                    <Box
                      key={index}
                      component="span"
                      sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                    >
                      {part.text}
                    </Box>
                  ))}
                  <Typography variant="body2" color="text.secondary" >
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </>
  );
}