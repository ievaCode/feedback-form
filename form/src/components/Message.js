import React  from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


const Message = ({text, open, handleClose}) => {
return(
    <Dialog open = {open} onClose = {handleClose}>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
        </DialogContent>
        {handleClose && 
            <DialogActions>            
                    <Button color="primary" onClick={handleClose}>ok</Button>            
            </DialogActions>
        }
    </Dialog>


)}  

export default Message;




