import React, { useState, useEffect }  from 'react';
import axios from 'axios';

// import './style/main.scss';
import Section from './components/Section';
import Message from './components/Message';

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
    },
    feedback: {
        textTransform: 'capitalize',
    },
}));


//----------Component-------------------//


function App() {

    let today = new Date();
    today = `${today.getFullYear().toString()}-${(today.getMonth() +1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;


    //---------States----------------------//

    
    const [data, setData] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [entry , setEntry] = useState({date: today, name:'', email:'', feedback:''})
    const [nameSearch, setNameSearch] = useState('');
    const [dateSearch, setDateSearch] = useState('');
    const [alert, setAlertStatus] = useState(false);
    const [message, setMessageStatus] = useState(false);


    //---------Styles----------------------//


    const classes = useStyles()

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios( "http://localhost:3212/feedbacks" );
            setData( result.data.body );
            setReviews( result.data.body );
        };
        fetchData();
    }, []);

//---------Map elements----------------------//

    const feedbacks = reviews.map((item, i) => {
        return(
            <ListItem key = {i} className={classes.feedback}>
                <ListItemText 
                    primary = {
                        <React.Fragment>  
                            {item.name}    
                            <Typography component="span" variant="body2" className={classes.smallDate} color="textPrimary">
                                {item.date}
                            </Typography>
                        </React.Fragment>
                    }       
                    secondary = {item.feedback}/>       
            </ListItem>
        )
    });

    //---------handlers & functions----------------------//

    const handleChange = event => {
        const {name , value} = event.target       
        setEntry( prevState => ({
            ...prevState,
            [name]: value
        })
    )}

    const handleSubmit = (event) => {
        event.preventDefault();
        if (entry.name) {
            if (data.filter (item => item.email === entry.email.toLowerCase()).length === 0) {
            const entryInLowerCase = {
                date:entry.date,
                name:entry.name.toLowerCase().trim().replace(/\s\s+/g, ' '),
                email:entry.email.toLowerCase().trim().replace(/\s\s+/g, ' '),
                feedback: entry.feedback.toLowerCase().trim()
            }     
            setData(data.concat(entryInLowerCase));
            {(!nameSearch && !dateSearch) && setReviews(reviews.concat(entry))};
            axios.post('http://localhost:3212/feedbacks', entryInLowerCase);
            setEntry({date:today, name:'', email:'', feedback:''});
            showMessage();
            } else {setAlertStatus(true)}
        } 
    };

    const showMessage = () => {
        setMessageStatus(true);
        setTimeout(() => {
            hideMessage()
        }, 1500)
    };
    const hideMessage = () => {
        setMessageStatus(false)
    };

const filterData = () =>{
    let filtered;
    if (dateSearch && !nameSearch)  { 
        filtered = data.filter (item => item.date === dateSearch);
    }  else if (!dateSearch && nameSearch) {
        filtered = data.filter (item => (item.name.includes(nameSearch)))
    }  else if (dateSearch && nameSearch)  { 
        filtered = data.filter (item => ((item.date === dateSearch) && (item.name.includes(nameSearch))));
    }  else {filtered = data}                                    
    setReviews(filtered)                        
}

    return (
        <div className="App">
            { message && 
                <Message text = 'Thanks for you feedback!' open={message} /> }
            { alert && 
                <Message text = 'You can leave your feedback just once' open={alert} handleClose= {() => {setAlertStatus(false)}}/> }
    
            <Section header = 'leave a review' >
                <form className={classes.form} onSubmit={handleSubmit}>           
                    <TextField
                        name="date"
                        value = {today}   
                        variant="filled"
                        margin="normal"
                        id="date-input"                                             
                        readOnly />
                    <TextField
                        name="name"
                        value={entry.name}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                        id="name-input"
                        label="name"                        
                        InputLabelProps={{shrink: true}}
                        autoFocus/>
                    <TextField
                        name="email"
                        value={entry.email}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                        id="email-input"
                        label="email"
                        InputLabelProps={{shrink: true}}/>
                    <TextField
                        name="feedback"
                        value={entry.feedback}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                        multiline
                        rows={6}
                        id="feedback-input"
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
                        onChange={event => setNameSearch(event.target.value.toLowerCase().trim().replace(/\s\s+/g, ' '))} 
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
                        onClick = {filterData}
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

