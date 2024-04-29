import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NotificationPage from "@/pages/Notification";

const useStyles = makeStyles((theme) => ({
  faqItem: {
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}));

function FAQ_Page() {
  const classes = useStyles();

  const faqItems = [
    { question: "How do I edit my profile information?", answer: "You can edit your profile information by clicking on the 'Settings' button on your profile page. From there, you can update your bio, profile picture, and other details." },
    { question: "How can I add or edit my courses?", answer: "To edit your courses, click on the 'Edit Your Courses' button on your profile page. You can then add or remove courses as needed." },
    { question: "Can I add a new course?", answer: "Yes, you can add a course that is not in the system by clicking on the '+ Add Course' button when editing your courses. Simply enter the course prefix and number to add it to your profile." },
    { question: "How do I disconnect from another user?", answer: "To disconnect from another user, click on the 'Disconnect' button on their profile page. This will end your connection with them." },
    { question: "How do I invite someone to a meetup?", answer: "While creating a meetup, there will be an option to invite your connected friends. They can then accept this invitation." },
    { question: "How do I see my pending connection requests?", answer: "Click the Buddies button, then click outgoing. You will be able to see all your pending outgoing requests that have not been acted on." },
    { question: "How do I find new connections?", answer: "You can either look at recommend users on the home page, or navigate to search users to look for a more specific user." }
  ];

  return (
    <>
    <NotificationPage />
            <br />
      {faqItems.map((item, index) => (
        <div key={index}>
          <Typography variant="h6" className={classes.faqItem}>
            {item.question}
          </Typography>
          <Card className={classes.card}>
            <CardContent>
              <Typography>
                {item.answer}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
      
    </>
  );
}

export default FAQ_Page;