import React, { useState } from 'react';
import { Typography, Menu, MenuItem, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  faqItem: {
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  answer: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
}));

function FAQ_Page() {
  const classes = useStyles();
  const [faqItems, setFaqItems] = useState([
    { question: "How do I edit my profile information?", answer: "You can edit your profile information by clicking on the 'Settings' button on your profile page. From there, you can update your bio, profile picture, and other details." },
    { question: "How can I add or edit my courses?", answer: "To edit your courses, click on the 'Edit Your Courses' button on your profile page. You can then add or remove courses as needed." },
    { question: "Can I add a new course?", answer: "Yes, you can add a course that is not in the system by clicking on the '+ Add Course' button when editing your courses. Simply enter the course prefix and number to add it to your profile." },
    { question: "How do I disconnect from another user?", answer: "To disconnect from another user, click on the 'Disconnect' button on their profile page. This will end your connection with them." },
    { question: "How do I invite someone to a meetup?", answer: "While creating a meetup, there will be an option to invite your connected friends. They can then accept this invitation." },
    { question: "How do I see my pending connection requests?", answer: "Click the Buddies button, then click outgoing. You will be able to see all your pending outgoing requests that have not been acted on." },
    { question: "How do I find new connections?", answer: "You can either look at recommend users on the home page, or navigate to search users to look for a more specific user." }
  ]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {faqItems.map((item, index) => (
        <div key={index}>
          <Typography className={classes.faqItem} onClick={(event) => handleClick(event, index)}>
            {item.question}
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            getContentAnchorEl={null}
          >
            <MenuItem className={classes.answer} onClick={handleClose}>
              {item.answer}
            </MenuItem>
          </Menu>
        </div>
      ))}
    </Box>
  );
}

export default FAQ_Page;