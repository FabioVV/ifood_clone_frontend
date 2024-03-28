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
import { getCurrentUser } from '../utils/UserlocalStorage';

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


export default function GooglePlaces({user_geolocation_fn, user_address_fn, user_address_obj}) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);



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

  // React.useEffect(()=>{console.log(value)}, [value])

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

            const results = await getGeocode({ address: inputValue })
            const {lat, lng} = await getLatLng(results[0])

            user_geolocation_fn({
              lat:lat,
              lng:lng,
              location:inputValue,
              result:results[0],
            })

            let user_address = {
              name:'',
              street:'',
              neighborhood:'',
              number:'',
              complement:'',
              city:'',
              state:'',
              zip_code:'',
              user:getCurrentUser()['id'],
            }


            for(let i = 0; i < results[0]['address_components'].length; i++){
              user_address.number = results[0]['address_components'][0]['long_name']
              user_address.zip_code = results[0]['address_components'][results[0]['address_components'].length]['long_name']
              user_address.state = results[0]['address_components'][4]['short_name']
              user_address.city = results[0]['address_components'][3]['long_name']
              user_address.neighborhood = results[0]['address_components'][1]['long_name']
              user_address.street = results[0]['address_components'][2]['long_name']
            }

            user_address_fn({...user_address_obj, ...user_address})


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
  );
}