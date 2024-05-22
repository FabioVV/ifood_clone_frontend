import { useEffect, useState, useRef } from "react"
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'


export default function ProgressBar({value, valueBuffer}) {
    const [progress, setProgress] = useState(value);
    const [buffer, setBuffer] = useState(valueBuffer);
  
    const progressRef = useRef(() => {});

    useEffect(() => {
      progressRef.current = () => {

        if(value == 100){
          setProgress(100);
          setBuffer(100);
        } else {
          if (progress > 50) {
            setProgress(0);
            setBuffer(50);

          } else {
            const diff = Math.random() * 25;
            const diff2 = Math.random() * 10;
            setProgress(progress + diff);
            setBuffer(buffer + diff2);
          }

        }

      
      };
    });
  
    useEffect(() => {
      const timer = setInterval(() => {
        progressRef.current();
      }, 500);
  
      return () => {
        clearInterval(timer);
      };
    }, []);
  
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
      </Box>
    );
}