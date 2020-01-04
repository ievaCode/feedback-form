import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';


//----------Styles-------------------//

const useStyles = makeStyles(theme => ({
    section: {
        padding: "50px 0"
    },
}));

//----------Component-------------------//

const Section = ({header, children}) => {

const classes = useStyles()

return(
    <section>
        <Container className={classes.section} maxWidth="sm">            
            <Typography   variant = "h2">{header}</Typography>
            <Box
                boxShadow= "0 6px 6px 0px #777"
                marginBottom = {6}
                width =  "70%"
                height = {6} />
            {children} 
        </Container>
    </section>  
)}  

export default Section;
