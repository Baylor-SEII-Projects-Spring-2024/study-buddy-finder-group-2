import React from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Grid, Typography, Stack } from '@mui/material';
import Link from 'next/link';
import NotificationPage from "@/pages/Notification";
import SensorsIcon from '@mui/icons-material/Sensors';
import GroupsIcon from '@mui/icons-material/Groups';

function AboutPage() {
    return (
        <>
            <NotificationPage />
            <br />

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{ textAlign: 'center', width: '900px', margin: '0 auto'}}>
                    <h1>Welcome to Studdy Buddy!</h1>
                    <br/>

                    <p style={{ marginBottom: '50px'}}>Welcome to StuddyBuddy, your destination for academic success through collaboration and connection. 
                        At StuCon, we understand the power of peers and the value of shared knowledge. 
                        That's why we've created an online platform where students like you can come together to study, learn, and make new experiences.</p>
                    <br/>
                    
                    <h1>What Sets Us Apart</h1>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <h3>Seamless Connection</h3>
                        <SensorsIcon style={{ marginLeft: '10px'}} />
                    </div>
                    <p>With StuddyBuddy, connecting with study buddies and tutors has never been easier. 
                        Our intuitive interface lets you browse profiles, discover potential study partners, and meetup with tutors in
                        just a few clicks. Whether you're looking for classmates from your university or peers with similar academic goals from afar, 
                        StuddyBuddy provides the platform to forge meaningful connections and expand your network.</p>
                    <br/>

                    <img src={'./connectionsExample.png'} alt="example of a user profile" style={{ width: '300px', height: '200px' }} />

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <h3>Community-Driven Meetups</h3>
                        <GroupsIcon style={{ marginLeft: '10px'}} />


                    </div>
                    <p style={{ marginBottom: '50px'}}>StuddyBuddy isn't just another study platform; it's a community of motivated learners eager to 
                        support each other. Our platform allows you to create and join meetups with fellow students who share your academic 
                        interests. Whether you're preparing for exams or simply seeking clarification on complex topics, you will find
                        a plethora of tutors who are willing to help. With our tutor rating feature, you can help StuddyBuddy recommend the very best
                        tutors and shoot them to the top!</p>

                        <img src={'./meetupsExample.png'} alt="example of a meetup" style={{ width: '400px', height: '400px' }} />

                    <br/>
                    <h1>Our Mission</h1>
                    <p>At StuddyBuddy, our mission is simple: to empower students to excel academically by fostering a culture of collaboration, 
                        support, and mutual respect. Whether you're struggling with a challenging course, seeking study buddies for a group 
                        project, or simply craving intellectual stimulation, StuddyBuddy is here to help you thrive.</p>
                </div>


            </div>
        </>
    );
}

export default AboutPage;