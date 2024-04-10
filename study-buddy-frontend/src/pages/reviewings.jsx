import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Card,
    CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
    Stack,
    Typography
} from "@mui/material";

function viewRatingsPage(){
    const [thisUser, setThisUser] = useState(null);
    
    const [ratingScore, setRatingScore] = useState(null);
    const [review, setReview] = useState(null);
    const [id, setId] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [selectedRating, setSelectedRating] = useState(null);
    //WIP get all useStates needed

    // get the user's username
    useEffect(() => {
        const params = new URLSearchParams(window.location.search),
            user = params.get("username");

        setThisUser(user);
        fetchRatings(user);
    }, [])


    
    //automatic get ratings for me
    const fetchRatings = async (user) => {
       
        console.log("User to fetch for: " + user);

        fetch(`http://localhost:8080/newRatings/${user}`) // use this for local development
        //fetch(`http://34.16.169.60:8080/newRatings/${user}`)
            .then(res => res.json())
            .then(data => setRatings(data))
            .catch(error => console.error('Error fetching ratings:', error));
    };

    
    
    const handleClickOpen = () => {
        setId(null);
        setSubject("");
        setOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleClose = () => {
        setOpen(false);
        document.body.style.overflow = 'auto';
    };

    //DIALOG 2 (EDIT RATING)
    const [openEdit, setOpenEdit] = React.useState(false);

    // takes in selected meeting to display content of that rating
    const handleClickOpenEdit = (rating) => {
        setSelectedRating(rating);

        // set state variables to the currently selected rating
        setReview(rating.review);
        setRatingScore(rating.ratingScore);

    

        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };


    return(
    <div>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
            {ratings.map((rating, index) => (
                <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1, height: 'auto'}} elevation={6}>
                    <CardContent>
                        <Typography variant='h4' align='center' sx={{ marginTop: '20px', fontWeight: 'bold'}}>{rating.ratingUser}'s Rating</Typography>
                        
                        <Typography variant='h6' align='center' sx={{ marginTop: '10px'}}>{rating.ratingScore} / 5 Stars</Typography>
                        
                        <Typography variant='body1' align='center' sx={{ marginTop: '10px'}}>{rating.review}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    </div>
    );
}
export default viewRatingsPage;