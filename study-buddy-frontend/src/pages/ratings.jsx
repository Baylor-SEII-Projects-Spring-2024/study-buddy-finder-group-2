import React, { useEffect, useState } from "react";
import axios from 'axios';
import NotificationPage from "@/pages/Notification";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";


function RatingsPage() {
  const [ratingType, setRatingType] = useState("Pending");
  const [thisUser, setThisUser] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [review, setReview] = useState('');
  const [id, setId] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [openEdit, setOpenEdit] = useState(false); 
  const [text, setText] = useState("Pending Ratings");
  const api = axios.create({
    //baseURL: 'http://localhost:8080/'
    baseUrl: 'http://34.16.169.60:8080/'
  });

  // get the user's username
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("username");
    setThisUser(user);
    fetchMadeRatings(user);
  }, []);

  const fetchMadeRatings = async (user) => {
    try {
      const res = await api.get(`viewMadeRatings/${user}`);
      console.log(res);
      setRatings(res.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchPendingRatings = async (user) => {
    try {
        const res = await api.get(`newRatings/${user}`);
        console.log(res);
        setRatings(res.data);
    } catch (error) {
        console.error('Error fetching ratings:', error);
    }
  };

  // get incoming or outgoing requests
  const handleSubmit = (value) => {
    // outgoing
    if (value === "Made") {
        setText("Made Ratings");
        fetchMadeRatings(thisUser);
    }
    // incoming
    else if (value === "Pending") {
        setText("Pending Ratings");
        fetchPendingRatings(thisUser);
    } else {
        console.log("error with request type?!");
    }
  }

  const handleClickOpenEdit = (rating) => {
    console.log(rating);
    
    setRatingScore(rating.ratingScore);
    setReview(rating.review);
    setOpenEdit(true);
    setId(rating.ratingId);
    console.log(id);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  // Function to remove a rating
  const removeRating = (ratingId) => {
    console.log("Deleting rating with ID:", ratingId);
  
    // Use axios to send a DELETE request to the API
    api.delete(`deleteRating/${ratingId}`)
      .then(() => {
        console.log("Rating deleted successfully.");
        // Remove the deleted rating from the state
        setRatings(prevRatings => prevRatings.filter(rating => rating.ratingId !== ratingId));
      })
      .catch(error => console.error('Error deleting rating:', error));
  };

  const handleUpdateRating = async (id) => {
    try {
        console.log(id);
        // Check if id is valid
        if (!id || isNaN(id)) {
            console.error("Invalid rating ID");
            return;
        }

        // Create a new object with updated properties
        const updatedRating = {
            ratingId: id,
            score: parseFloat(ratingScore),
            review: review
        };

        const response = await api.put(`updateRating/${id}`, updatedRating);
        if (response.status === 200) {
            handleCloseEdit();
            if (text == "Made"){ fetchMadeRatings(thisUser);}
            else {fetchPendingRatings(thisUser);}
           
        } else { 
            console.error("Failed to update rating.");
        }
    } catch (error) {
        console.error("Error updating rating:", error);
    }
  };

  return (
    <div>
      {/* NotificationPage component */}
      <NotificationPage></NotificationPage><br/>
      <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
        <Card sx={{ width: 520, margin: 'auto' }} elevation={4}>
          <CardContent>
            <Typography variant='h4' align='center'>Your Made Ratings</Typography>
          </CardContent>
        </Card>
  
        {/* this is the search area, submits a form */}
        <Box component="form" noValidate sx={{ paddingTop: 3, width: 550, margin: 'auto' }}>
          <Stack spacing={4} direction="row" justifyContent="center">
            {/* get request type (incoming or outgoing) */}
            <ToggleButtonGroup
              color="success"
              value={ratingType}
              exclusive
              onChange={(e, value) => {
                setRatingType(value);
                handleSubmit(value);
              }}
              label="request type"
              type="submit"
            >
              <ToggleButton value={"Made"}>
                Made
              </ToggleButton>
              <ToggleButton value={"Pending"}>
                Pending
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
        {ratings.length > 0 ? (
          ratings.map((rating, index) => (
            <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1, height: 'auto'}} elevation={6}>
              <CardContent>
                <Typography variant='h4' align='center' sx={{ marginTop: '20px', fontWeight: 'bold'}}>
                  Rating for {rating.ratedUser.username}
                </Typography>
                <Typography variant='h6' align='center' sx={{ marginTop: '20px', fontWeight: 'normal'}}>
                  Meeting: {rating.meetingTitle}
                </Typography>
                <Typography variant='h6' align='center' sx={{ marginTop: '10px'}}>
                  {rating.score} / 5 Stars
                </Typography>
                <Typography variant='body1' align='center' sx={{ marginTop: '10px'}}>
                  Review: 
                  {rating.review}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <Button onClick={() => handleClickOpenEdit(rating)} variant="contained" sx={{ marginRight: '10px' }}>
                    Edit Rating
                  </Button>
                  <Button onClick={() => removeRating(rating.ratingId)} variant="outlined" color="secondary">
                    Remove Rating
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" align="center">
            No ratings available.
          </Typography>
        )}
  
      </Stack>
  
      {/*View user profile and add as connection*/}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Rating</DialogTitle>
        <DialogContent>
          <input 
            type="number" 
            value={ratingScore} 
            onChange={(e) => setRatingScore(parseFloat(e.target.value))}  
            onBlur={() => setRatingScore(Math.min(Math.max(ratingScore, 0.5), 5))}
          />
          <textarea value={review} onChange={(e) => setReview(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={() => handleUpdateRating(id)}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RatingsPage;