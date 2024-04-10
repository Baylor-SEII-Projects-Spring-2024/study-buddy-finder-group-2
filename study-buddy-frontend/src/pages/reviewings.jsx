import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";

function viewRatingsPage() {
  const [thisUser, setThisUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const api = axios.create({
    // For local testing
    // baseURL: 'http://localhost:8080/'
    // For deployment
    baseURL: 'http://34.16.169.60:8080/'
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
    // fetch(`http://localhost:8080/newRatings/${user}`) // Use this for local testing
    fetch('')
      .then(res => res.json())
      .then(data => setRatings(data))
      .catch(error => console.error('Error fetching ratings:', error));
  };

  // Function to remove a rating
  const removeRating = (ratingId) => {
    fetch(`http://localhost:8080/deleteRating/${ratingId}`, {
      method: 'DELETE'
    })
      .then(() => {
        // Remove the deleted rating from the state
        setRatings(prevRatings => prevRatings.filter(rating => rating.id !== ratingId));
      })
      .catch(error => console.error('Error deleting rating:', error));
  };

  return (
    <div>
      <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
        {ratings.map((rating, index) => (
          <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1, height: 'auto'}} elevation={6}>
            <CardContent>
              <Typography variant='h4' align='center' sx={{ marginTop: '20px', fontWeight: 'bold'}}>{rating.ratingUser}'s Rating</Typography>
              <Typography variant='h6' align='center' sx={{ marginTop: '10px'}}>{rating.ratingScore} / 5 Stars</Typography>
              <Typography variant='body1' align='center' sx={{ marginTop: '10px'}}>{rating.review}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Button onClick={() => removeRating(rating.id)} variant="outlined" color="secondary">Remove Rating</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </div>
  );
}

export default viewRatingsPage;