import React, { useEffect, useState } from "react";
import axios from 'axios';
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
  Typography
} from "@mui/material";
import { Score } from "@mui/icons-material";

function viewNewRatingsPage() {
  const [thisUser, setThisUser] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [review, setReview] = useState('');
  const [id, setId] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [openEdit, setOpenEdit] = useState(false); 
  const api = axios.create({
    baseURL: 'http://localhost:8080/'
    //baseUrl: 'http://34.16.169.60:8080/'
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("username");

    setThisUser(user);
    fetchRatings(user);
}, []);

const fetchRatings = async (user) => {
    try {
        const res = await api.get(`newRatings/${user}`);
        console.log(res);
        setRatings(res.data);
    } catch (error) {
        console.error('Error fetching ratings:', error);
    }
};

const handleClickOpenEdit = (rating) => {
    console.log(rating);
    
    setSelectedRating(rating);
    setRatingScore(rating.ratingScore);
    setReview(rating.review);
    setOpenEdit(true);
    setId(rating.ratingId);
    console.log(id);
    
};

const handleCloseEdit = () => {
    setOpenEdit(false);
};
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
            fetchRatings(thisUser);
        } else {
            console.error("Failed to update rating.");
        }
    } catch (error) {
        console.error("Error updating rating:", error);
    }
};

return (
    <div>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
            {ratings.map((rating, index) => (
                
                <Card key={index} sx={{ width: 500, margin: 'auto', marginTop: 1, height: 'auto'}} elevation={6}>
                    <CardContent>
                        <Typography variant='h4' align='center' sx={{ marginTop: '20px', fontWeight: 'bold'}}> Rating for {rating.ratedUser.username}</Typography>
                        <Button onClick={() => handleClickOpenEdit(rating)} variant="contained" sx={{ marginTop: '10px' }}>
                            Make Rating
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <Button onClick={() => removeRating(rating.ratingId)} variant="outlined" color="secondary">
                                Remove Rating
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Stack>

        <Dialog open={openEdit} onClose={handleCloseEdit}>
            <DialogTitle>Edit Rating</DialogTitle>
            <DialogContent>
                <input type="number" value={ratingScore} onChange={(e) => 
                setRatingScore(parseFloat(e.target.value))}  />
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
export default viewNewRatingsPage;