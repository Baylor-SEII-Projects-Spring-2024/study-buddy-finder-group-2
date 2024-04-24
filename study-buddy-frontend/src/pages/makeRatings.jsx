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
  Rating,
  TextField,
  index
} from "@mui/material";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";

function RatingsPage() {
    const router = useRouter();

    const token = useSelector(state => state.authorization.token); //get current state
    const dispatch = useDispatch(); // use to change state

    const [thisUser, setThisUser] = useState(null);
    const [ratingScore, setRatingScore] = useState(0);
    const [review, setReview] = useState('');
    const [id, setId] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);

  const api = axios.create({
      baseURL: 'http://localhost:8080/',
      //baseUrl: 'http://34.16.169.60:8080/',
      // must add the header to associate requests with the authenticated user
      headers: {'Authorization': `Bearer ${token}`},
  });

  // get the user's username
  useEffect(() => {
      try{
          // only authorized users can do this (must have token)
          const decodedUser = jwtDecode(token);
          setThisUser(decodedUser.sub);

          fetchPendingRatings(decodedUser.sub);
      }
      catch(err) {
          router.push(`/error`);
      }
  }, []);

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
            fetchPendingRatings(thisUser);
           
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
            <Typography variant='h4' align='center'>Your Pending Ratings</Typography>
          </CardContent>
        </Card>
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
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <Button onClick={() => handleClickOpenEdit(rating)} variant="contained" sx={{ marginRight: '10px' }}>
                    Make Rating
                  </Button>
                  <Button onClick={() => removeRating(rating.ratingId)} variant="contained" style={{ backgroundColor: '#ff6961', color:  'white' }}>
                    Remove Rating
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1, height: 'auto'}} elevation={6}>
            <CardContent>
              <Typography variant="body1" align="center">
                No ratings available.
              </Typography>
            </CardContent>
          </Card>
         
        )}
  
      </Stack>
  
      {/*View user profile and add as connection*/}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Make Rating</DialogTitle>
          <DialogContent style={{ height: '300px' }}>
            <Rating
                name="rating-score"
                value={ratingScore}
                precision={0.5}
                onChange={(e, newValue) => setRatingScore(newValue)}
            />
            <TextField
                label="Review"
                multiline
                rows={5}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
        
                InputLabelProps={{ style: { color: 'black' } }} 
            />
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={() => handleUpdateRating(id)}>Save Rating</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RatingsPage;