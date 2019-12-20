import React, { useState, useEffect }  from 'react';
import axios from 'axios';

import './style/main.scss';
import Section from './components/Section';

import { Button, TextField } from '@material-ui/core';
import { List, ListItem, ListItemText} from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Box } from '@material-ui/core';


//----------Styles-------------------//

const useStyles = makeStyles(theme => ({
    smallDate: {
        fontSize: '0.8rem',
        display: 'block',
        marginBottom: '10px'
    },
    formButton: {
        marginTop: "30px"
    },
    form: {
        padding: "30px",
        width: "100%",
        maxWidth: "500px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 3px 6px 0px #777",
    },
    filter: {
        marginBottom: "20px"
    }
}));


//----------Component-------------------//


function App() {

//---------States----------------------//

const [data, setData] = useState([]);
const [reviews, setReviews] = useState([]);
const [nameSearch, setNameSearch] = useState();
const [dateSearch, setDateSearch] = useState();

//---------States----------------------//


const classes = useStyles()

useEffect(() => {
    const fetchData = async () => {
        const result = await axios(
        "http://localhost:3212/feedbacks",
        );
        setData(result.data.body);
        setReviews(result.data.body);
    };
    fetchData();
}, []);

const feedbacks = reviews.map((item, i) => {
return(
    <ListItem key = {i} >
        <ListItemText 
            primary = {
                <React.Fragment>  
                    {item.name}    
                    <Typography component="span" variant="body2" className={classes.smallDate} color="textPrimary">
                        {item.date}
                    </Typography>
                </React.Fragment>
            }       
            secondary = {item.feedback} multiline/>       
    </ListItem>
)
});

let today = new Date();
today = `${today.getFullYear().toString()}-${(today.getMonth() +1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;


return (
    <div className="App">
        <Section header = 'leave a review' >
            <form className={classes.form} action = "http://localhost:3212/feedbacks" method="post" onSubmit={(event) => { alert('Thanks for your feedback!') }}>           
                <TextField
                    variant="filled"
                    margin="normal"
                    id="date-input"
                    name="date"
                    value = {today}
                    readOnly />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="name-input"
                    label="name"
                    name="name"
                    InputLabelProps={{shrink: true}}
                    autoFocus />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="email-input"
                    label="email"
                    InputLabelProps={{shrink: true}}
                    name="email" />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    multiline
                    rows={6}
                    id="feedback-input"
                    name="feedback"
                    label="your feedback" 
                    InputLabelProps={{shrink: true}}                   
                    type="text" />                                
                <Button
                    className={classes.formButton} 
                    label="submit"
                    type="submit"
                    fullWidth
                    variant="contained" >
                    Submit
                </Button>  
            </form>
        </Section>
        <Section header = 'what others say'>
            <Box className={classes.filter} display = "flex" justifyContent = "space-between" > 
                <TextField
                    variant = "outlined"
                    id = "name-filter"
                    label = "filter by name"
                    placeholder = "name"
                    name = "by-name"
                    size = 'small'
                    InputLabelProps={{shrink: true}}
                    onChange={event => setNameSearch(event.target.value.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' '))} 
                    />
                <TextField
                    variant = "outlined"
                    id = "name-fidate"
                    placeholder = "yyyy-mm-dd"
                    label ="filter by date"
                    name = "by-date"  
                    size = 'small'
                    InputLabelProps={{shrink: true}}
                    onChange={event => setDateSearch(event.target.value) } />       
                <Button 
                    onClick = {() =>{
                        let filtered;
                        if (dateSearch && !nameSearch)  { 
                            filtered = data.filter (item => item.date === dateSearch);
                        }  else if (!dateSearch && nameSearch) {
                            filtered = data.filter (item => (item.name.includes(nameSearch)))
                        }  else if (dateSearch && nameSearch)  { 
                            filtered = data.filter (item => ((item.date === dateSearch) && (item.name === nameSearch)));
                        }  else {filtered = data}                                    
                        setReviews(filtered)                        
                    }}
                    label = "filter"
                    variant = "contained" 
                    style = {{height : '39px'}} >
                    Filter
                </Button>  
                </Box>
            <List>
                {feedbacks}
            </List>
        </Section>  
    </div>
    );
}

export default App;

