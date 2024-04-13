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

function viewRatingsPage() {
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
      const res = await api.get(`viewRatingsForMe/${user}`);
      console.log(res);
      setRatings(res.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  

  return (
    <div>
      <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
        {ratings.length > 0 ? (
          ratings.map((rating, index) => (
            <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1, height: 'auto'}} elevation={6}>
              <CardContent>
                <Typography variant='h4' align='center' sx={{ marginTop: '20px', fontWeight: 'bold'}}>
                  {rating.ratedUser.username}'s Rating
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
export default viewRatingsPage;