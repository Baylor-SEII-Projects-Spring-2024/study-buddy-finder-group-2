import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";

function viewMadeRatingsPage() {
  const [thisUser, setThisUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const api = axios.create({
    // For local testing
    baseURL: 'http://localhost:8080/'
    // For deployment
    // baseURL: 'http://34.16.169.60:8080/'
  });

  // get the user's username
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("username");

    setThisUser(user);
    fetchRatings(user);
  }, []);

  // Fetch ratings for the current user
  const fetchRatings = async (user) => {
    try {
      const res = await api.get(`viewMadeRatings/${user}`);
      console.log(res);
      setRatings(res.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
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

  return (
    <div>
      <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
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
    </div>
  );
}
export default viewMadeRatingsPage;